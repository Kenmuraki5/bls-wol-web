package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"time"

	"bls-wol-web/database"
	"bls-wol-web/models"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

func EventsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}
	ctx := r.Context()

	vars := mux.Vars(r)
	userId := vars["userId"]

	for {
		select {
		case <-ctx.Done():
			fmt.Println("Connection closed by client, stopping pings.")
			return
		default:
			// Query the database for computers
			var computers []models.Computer
			if err := database.DB.Where("user_id = ?", userId).Find(&computers).Error; err != nil {
				fmt.Println("Failed to retrieve computers:", err)
				http.Error(w, "Database query failed", http.StatusInternalServerError)
				return
			}

			results := make(chan models.Computer, len(computers))

			// Ping computers concurrently
			for _, computer := range computers {
				go func(computer models.Computer) {
					// Check the IP status (this might take some time)
					computer.Status = checkIPStatus(computer.Ip)
					results <- computer
				}(computer)
			}

			// Collect updated computer statuses
			var updatedComputers []models.Computer
			for i := 0; i < len(computers); i++ {
				updatedComputers = append(updatedComputers, <-results)
			}

			// Marshal the data to JSON
			message, err := json.Marshal(updatedComputers)
			if err != nil {
				fmt.Println("Failed to marshal data:", err)
				http.Error(w, "Data marshalling failed", http.StatusInternalServerError)
				return
			}

			// Send the updated data to the client
			fmt.Fprintf(w, "data: %s\n\n", message)
			flusher.Flush()

			// Wait for 60 seconds before the next update
			time.Sleep(60 * time.Second)
		}
	}
}

func AdminMonitorByNetwork(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	// ใช้ Context เพื่อตรวจสอบการยกเลิกเมื่อ client ปิดการเชื่อมต่อ
	ctx := r.Context()
	vars := mux.Vars(r)
	networkId := vars["networkId"]

	for {
		select {
		case <-ctx.Done():
			fmt.Println("Connection closed by client, stopping pings.")
			return
		default:
			var computers []models.Computer
			if err := database.DB.Where("network_id = ?", networkId).Preload("Network").Find(&computers).Error; err != nil {
				fmt.Println("Failed to retrieve computers:", err)
				http.Error(w, "Database query failed", http.StatusInternalServerError)
				return
			}

			results := make(chan models.Computer, len(computers))
			for _, computer := range computers {
				go func(computer models.Computer) {
					computer.Status = checkIPStatus(computer.Ip)
					results <- computer
				}(computer)
			}

			var updatedComputers []models.Computer
			for i := 0; i < len(computers); i++ {
				updatedComputers = append(updatedComputers, <-results)
			}

			message, err := json.Marshal(updatedComputers)
			if err != nil {
				fmt.Println("Failed to marshal data:", err)
				http.Error(w, "Data marshalling failed", http.StatusInternalServerError)
				return
			}

			fmt.Fprintf(w, "data: %s\n\n", message)
			flusher.Flush()

			time.Sleep(60 * time.Second)
		}
	}
}

func AdminMonitorAllDevices(rdb *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
			return
		}

		ctx := r.Context()

		for {
			select {
			case <-ctx.Done():
				fmt.Println("Connection closed by client, stopping pings.")
				return
			default:
				var computers []models.Computer
				if err := database.DB.Preload("Network").Find(&computers).Error; err != nil {
					fmt.Println("Failed to retrieve computers:", err)
					http.Error(w, "Database query failed", http.StatusInternalServerError)
					return
				}

				for _, computer := range computers {
					// ส่งข้อมูลคอมพิวเตอร์ไปที่ Redis Queue
					data, err := json.Marshal(computer)
					if err != nil {
						fmt.Println("Failed to marshal data:", err)
						continue
					}

					// ส่งงานไปที่ queue
					err = rdb.RPush(ctx, "computer_tasks", data).Err()
					if err != nil {
						fmt.Println("Failed to push task to Redis queue:", err)
					}
				}

				// รอผลลัพธ์จาก worker
				var updatedComputers []models.Computer
				for i := 0; i < len(computers); i++ {
					// ดึงผลลัพธ์จาก Redis queue
					result, err := rdb.BLPop(ctx, 0*time.Second, "computer_results").Result()
					if err != nil {
						fmt.Println("Failed to retrieve result from Redis:", err)
						continue
					}

					var computer models.Computer
					err = json.Unmarshal([]byte(result[1]), &computer)
					if err != nil {
						fmt.Println("Failed to unmarshal result:", err)
						continue
					}

					updatedComputers = append(updatedComputers, computer)
				}

				// ส่งผลลัพธ์กลับไปที่ client
				message, err := json.Marshal(updatedComputers)
				if err != nil {
					fmt.Println("Failed to marshal data:", err)
					http.Error(w, "Data marshalling failed", http.StatusInternalServerError)
					return
				}

				fmt.Fprintf(w, "data: %s\n\n", message)
				flusher.Flush()

				time.Sleep(60 * time.Second)
			}
		}
	}
}

func CheckIPWorker(rdb *redis.Client, ctx context.Context, queue string) {
	for {
		select {
		case <-ctx.Done():
			log.Println("Worker stopped")
			return // หยุด worker เมื่อ context ถูกยกเลิก
		default:
			// ดึงงานจาก queue
			result, err := rdb.BLPop(ctx, 0*time.Second, "computer_tasks", queue).Result()
			if err != nil {
				fmt.Println("Failed to pop task from Redis:", err)
				continue
			}

			var computer models.Computer
			err = json.Unmarshal([]byte(result[1]), &computer)
			if err != nil {
				fmt.Println("Failed to unmarshal task data:", err)
				continue
			}

			// ตรวจสอบสถานะ IP
			computer.Status = checkIPStatus(computer.Ip)

			// ส่งผลลัพธ์กลับไปที่ queue
			data, err := json.Marshal(computer)
			if err != nil {
				fmt.Println("Failed to marshal result:", err)
				continue
			}

			err = rdb.RPush(ctx, "computer_results", data).Err()
			if err != nil {
				fmt.Println("Failed to push result to Redis:", err)
			}
		}
	}
}

func checkIPStatus(ip string) string {
	var cmd *exec.Cmd
	if runtime.GOOS == "windows" {
		cmd = exec.Command("ping", "-n", "1", "-w", "2", ip)
	} else {
		cmd = exec.Command("ping", "-c", "1", "-W", "2", ip)
	}

	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Ping error for IP %s: %s\n", ip, err)
		fmt.Println(string(output))
		return "offline"
	}
	return "online"
}

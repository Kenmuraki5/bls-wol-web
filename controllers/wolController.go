package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"
	"time"

	"bls-wol-web/database"
	"bls-wol-web/models"
	"bls-wol-web/wol"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

func Wol(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	userIdStr := "1"

	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid userId: %v", err), http.StatusBadRequest)
		return
	}

	var computer models.Computer
	if err := database.DB.Where("id = ?", idStr).Where("user_id = ?", userId).
		Preload("Network").
		First(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Computer Not Found or you don't have permission: %v", err), http.StatusNotFound)
		return
	}

	status := "success"
	if err := wol.WakeOnLan(computer.Mac, computer.Ip, computer.Network.BroadcastAddress, computer.Port); err != nil {
		status = "failed"
		fmt.Println(computer.Mac, computer.Ip)
		fmt.Println("Error:", err)
		http.Error(w, fmt.Sprintf("Fail to WOL: %v", err), http.StatusBadRequest)
	}

	message, logErr := AddWakeLog(computer.Id, uint(userId), status)
	if logErr != nil {
		http.Error(w, fmt.Sprintf("Failed to add wake log: %v", logErr), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": message})
}

type WolsRequest struct {
	Ids []int `json:"ids"`
}

func Wols(w http.ResponseWriter, r *http.Request) {
	var requestBody WolsRequest
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
		return
	}

	idInts := requestBody.Ids

	var wg sync.WaitGroup
	results := make(map[string]map[string]string)
	resultChan := make(chan map[string]string, len(idInts))

	for _, id := range idInts {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()

			var computer models.Computer
			if err := database.DB.Where("id = ?", id).
				Preload("Network").
				First(&computer).Error; err != nil {
				resultChan <- map[string]string{
					"id":      fmt.Sprintf("%d", id),
					"status":  "failed",
					"message": fmt.Sprintf("Computer Not Found or you don't have permission: %v", err),
				}
				return
			}

			status := "success"
			if err := wol.WakeOnLan(computer.Mac, computer.Ip, computer.Network.NetworkAddress, computer.Port); err != nil {
				status = "failed"
				fmt.Println(computer.Mac, computer.Ip)
				fmt.Println("Error:", err)
				resultChan <- map[string]string{
					"id":      fmt.Sprintf("%d", id),
					"status":  status,
					"message": fmt.Sprintf("Fail to WOL: %v", err),
				}
				return
			}

			message, logErr := AddWakeLog(computer.Id, computer.UserId, status)
			if logErr != nil {
				resultChan <- map[string]string{
					"id":      fmt.Sprintf("%d", id),
					"status":  status,
					"message": fmt.Sprintf("Failed to add wake log: %v", logErr),
				}
				return
			}

			resultChan <- map[string]string{
				"id":      fmt.Sprintf("%d", id),
				"status":  status,
				"message": message,
			}
		}(id)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	for result := range resultChan {
		results[result["id"]] = result
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(results)
}

// func Wols(w http.ResponseWriter, r *http.Request) {
// 	var requestBody WolsRequest
// 	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
// 		http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
// 		return
// 	}

// 	idInts := requestBody.Ids
// 	ctx := context.Background()
// 	redisClient := database.RedisClient

// 	var logs []models.WakeLog // สตั๊ดสำหรับล็อกทั้งหมด
// 	var results []string      // สำหรับผลลัพธ์แต่ละรายการ

// 	for _, id := range idInts {
// 		var computer models.Computer
// 		if err := database.DB.Where("id = ?", id).
// 			Preload("Network").
// 			First(&computer).Error; err != nil {
// 			// บันทึกการล็อกข้อผิดพลาด
// 			logs = append(logs, models.WakeLog{ComputerId: 0, UserId: 0, Status: "failed"})
// 			results = append(results, fmt.Sprintf("Failed to find computer with ID: %d", id))
// 			continue
// 		}

// 		job := wol.WakeUpJob{
// 			MAC:              computer.Mac,
// 			IP:               computer.Ip,
// 			BroadcastAddress: computer.Network.BroadcastAddress,
// 			Port:             int(computer.Port),
// 		}

// 		jobData, err := json.Marshal(job)
// 		if err != nil {
// 			logs = append(logs, models.WakeLog{ComputerId: computer.Id, UserId: computer.UserId, Status: "failed"})
// 			results = append(results, fmt.Sprintf("Failed to marshal job for computer ID: %d", id))
// 			continue
// 		}

// 		if err := redisClient.RPush(ctx, "wake_on_lan_queue", jobData).Err(); err != nil {
// 			logs = append(logs, models.WakeLog{ComputerId: computer.Id, UserId: computer.UserId, Status: "failed"})
// 			results = append(results, fmt.Sprintf("Failed to add job to Redis for computer ID: %d", id))
// 			continue
// 		}

// 		// บันทึกการล็อกสำเร็จ
// 		logs = append(logs, models.WakeLog{ComputerId: computer.Id, UserId: computer.UserId, Status: "success"})
// 		results = append(results, fmt.Sprintf("Job scheduled successfully for computer ID: %d", id))
// 	}

// 	// บันทึกข้อมูลล็อกทั้งหมดในฐานข้อมูล
// 	for _, log := range logs {
// 		_, _ = AddWakeLog(log.ComputerId, log.UserId, log.Status)
// 	}

// 	// ส่งการตอบกลับ
// 	if len(results) > 0 {
// 		w.WriteHeader(http.StatusAccepted)
// 		json.NewEncoder(w).Encode(map[string]string{"message": fmt.Sprintf("%d jobs processed", len(results)), "details": strings.Join(results, "; ")})
// 	} else {
// 		w.WriteHeader(http.StatusBadRequest)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "No jobs processed successfully"})
// 	}
// }

type WolRequest struct {
	MacAddress       string `json:"mac_address"`
	IpAddr           string `json:"ip_address"`
	BroadcastAddress string `json:"broadcast_address"`
	Port             uint32 `json:"port"`
}

func WolClient(w http.ResponseWriter, r *http.Request) {
	var reqBody WolRequest

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println(reqBody)
	if err := wol.WakeOnLan(reqBody.MacAddress, reqBody.IpAddr, reqBody.BroadcastAddress, reqBody.Port); err != nil {
		fmt.Println(reqBody.MacAddress, reqBody.IpAddr)
		fmt.Println("Error:", err)
		http.Error(w, fmt.Sprintf("Failed to WOL: %v", err), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "success"})
}

type WakeUpRequest struct {
	MAC            string `json:"mac"`            // MAC address
	IP             string `json:"ip"`             // IP address
	NetworkAddress string `json:"networkAddress"` // Network address
	Port           int    `json:"port"`           // Port
	WakeUpTime     string `json:"wakeUpTime"`     // เวลาที่ตั้งไว้ในรูปแบบ "2024-09-25T15:00:00Z"
}

func SetWakeUpTime(redisClient *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req WakeUpRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
			return
		}

		wakeUpTime, err := time.Parse(time.RFC3339, req.WakeUpTime)
		if err != nil {
			http.Error(w, "Invalid wake-up time format", http.StatusBadRequest)
			return
		}

		// เพิ่มข้อมูลลง Redis queue
		ctx := context.Background()
		err = wol.QueueWakeUp(redisClient, ctx, req.MAC, req.IP, req.NetworkAddress, req.Port, wakeUpTime)
		if err != nil {
			http.Error(w, "Error scheduling wake-up time: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// ส่งการตอบกลับว่าเพิ่มงานเรียบร้อยแล้ว
		w.Write([]byte("Wake-up time scheduled successfully"))
	}
}

func GetWakeUpJobs(redisClient *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// ตรวจสอบว่าการร้องขอเป็น GET
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// ดึงข้อมูลจาก Redis queue
		ctx := context.Background()

		// ตรวจสอบประเภทของ key ก่อนดึงข้อมูล
		exists, err := redisClient.Exists(ctx, "wake_on_lan_queue").Result()
		if err != nil {
			http.Error(w, "Error checking key existence: "+err.Error(), http.StatusInternalServerError)
			return
		}
		if exists == 0 {
			// ถ้า key ไม่พบ
			http.Error(w, "No jobs found", http.StatusNotFound)
			return
		}

		// ดึงข้อมูลจาก Redis queue
		jobs, err := redisClient.LRange(ctx, "wake_on_lan_queue", 0, -1).Result()
		if err != nil {
			http.Error(w, "Error retrieving jobs from Redis: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// แปลงข้อมูลเป็น JSON
		response, err := json.Marshal(jobs)
		if err != nil {
			http.Error(w, "Error converting jobs to JSON: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// ตั้งค่า Content-Type เป็น application/json
		w.Header().Set("Content-Type", "application/json")
		// ส่งการตอบกลับ
		w.Write(response)
	}
}

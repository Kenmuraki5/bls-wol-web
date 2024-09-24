package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
)

type WakeUpJob struct {
	MAC            string    `json:"mac"`
	IP             string    `json:"ip"`
	NetworkAddress string    `json:"network_address"`
	Port           int       `json:"port"`
	WakeUpTime     time.Time `json:"wake_up_time"`
}

func ScheduleWakeUp(redisClient *redis.Client, ctx context.Context, mac string, ip string, networkAddress string, port int, wakeUpTime time.Time) error {
	job := WakeUpJob{
		MAC:            mac,
		IP:             ip,
		NetworkAddress: networkAddress,
		Port:           port,
		WakeUpTime:     wakeUpTime,
	}

	// แปลง struct เป็น JSON
	jobData, err := json.Marshal(job)
	if err != nil {
		return fmt.Errorf("error marshaling job to JSON: %v", err)
	}

	err = redisClient.LPush(ctx, "wake_on_lan_queue", jobData).Err()
	if err != nil {
		return fmt.Errorf("error adding job to Redis queue: %v", err)
	}
	return nil
}

func worker(redisClient *redis.Client, ctx context.Context) {
	for {
		log.Printf("Worker: Waiting for job...\n")
		jobData, err := redisClient.BRPop(ctx, 0, "wake_on_lan_queue").Result()
		if err != nil {
			log.Printf("Worker: error popping job from Redis: %v", err)
			continue
		}

		log.Printf("Worker: Got job: %s\n", jobData[1])

		// jobData[1] จะเป็นข้อมูล job ที่เราดึงมา
		var job WakeUpJob
		err = json.Unmarshal([]byte(jobData[1]), &job)
		if err != nil {
			log.Printf("Worker: error unmarshaling job: %v", err)
			continue
		}

		// ทำการ wake up device
		fmt.Printf("Worker: Waking up device %s at %s\n", job.MAC, job.IP)

		// สามารถเพิ่ม logic ที่นี่เพื่อ wake up device ด้วย Wake-on-LAN protocol
		time.Sleep(1 * time.Second) // จำลองเวลาในการทำงาน
	}
}

func main() {
	ctx := context.Background()

	// ตั้งค่าการเชื่อมต่อ Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // เปลี่ยนที่อยู่ตามความต้องการ
		Password: "",               // ไม่มี password หรือระบุ password หากต้องการ
		DB:       0,                // ใช้ฐานข้อมูล 0
	})

	// สร้าง job หลายตัว
	for i := 0; i < 10; i++ {
		mac := fmt.Sprintf("01:23:45:67:89:%02X", i)
		err := ScheduleWakeUp(redisClient, ctx, mac, "192.168.1.100", "192.168.1.0", 9, time.Now().Add(time.Duration(i)*time.Second))
		if err != nil {
			log.Fatalf("Failed to schedule wake up job: %v", err)
		}
	}

	// สร้าง worker ตัวเดียว
	go worker(redisClient, ctx) // เริ่ม worker ตัวเดียวใน goroutine

	// รอให้โปรแกรมทำงานไปเรื่อยๆ
	select {}
}

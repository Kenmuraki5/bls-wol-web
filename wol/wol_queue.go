package wol

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
)

func SendMagicPacket(redisClient *redis.Client, ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			log.Println("Worker stopped")
			return // หยุด worker เมื่อ context ถูกยกเลิก
		default:
			jobData, err := redisClient.LPop(ctx, "wake_on_lan_queue").Result()

			if err != nil {
				if err == redis.Nil {
					time.Sleep(1 * time.Second)
					continue
				}
				log.Printf("Error fetching job from Redis queue: %v", err)
				continue
			}
			fmt.Println(jobData)
			// แปลง JSON กลับเป็น struct
			var job WakeUpJob
			if err := json.Unmarshal([]byte(jobData), &job); err != nil {
				log.Printf("Error unmarshaling job data: %v", err)
				continue
			}

			// ส่ง Magic Packet
			if err = WakeOnLan(job.MAC, job.IP, job.BroadcastAddress, uint32(job.Port)); err != nil {
				log.Printf("Error sending Magic Packet to %s: %v", job.IP, err)
			}
		}
	}
}

type WakeUpJob struct {
	MAC              string
	IP               string
	BroadcastAddress string
	Port             int
}

func QueueWakeUp(redisClient *redis.Client, ctx context.Context, mac string, ip string, broadcastAddress string, port int, wakeUpTime time.Time) error {
	job := WakeUpJob{
		MAC:              mac,
		IP:               ip,
		BroadcastAddress: broadcastAddress,
		Port:             port,
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

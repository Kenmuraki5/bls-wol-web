package controllers

import (
	"context"
	"fmt"
	"log"
	"net"
	"time"

	"github.com/go-redis/redis/v8"
)

func SendMagicPacket(redisClient *redis.Client, ctx context.Context) {
	for {
		// ดึงข้อมูลงานจาก Redis Queue
		jobData, err := redisClient.LPop(ctx, "wake_on_lan_queue").Result()
		if err != nil {
			if err == redis.Nil {
				// No more jobs, sleep for a while
				time.Sleep(1 * time.Second)
				continue
			}
			log.Printf("Error fetching job from Redis queue: %v", err)
			continue
		}

		// ประมวลผล jobData
		// ตัวอย่าง: "00:11:22:33:44:55,192.168.0.1,192.168.0.0,9"
		var mac, ip, networkAddress string
		var port int
		fmt.Sscanf(jobData, "%s,%s,%s,%d", &mac, &ip, &networkAddress, &port)

		// ส่ง Magic Packet
		err = sendMagicPacket(mac, ip, port)
		if err != nil {
			log.Printf("Error sending Magic Packet to %s: %v", ip, err)
		}
	}
}

func sendMagicPacket(mac string, ip string, port int) error {
	// สร้าง Magic Packet
	packet := createMagicPacket(mac)

	// ส่ง Magic Packet
	addr := fmt.Sprintf("%s:%d", ip, port)
	conn, err := net.Dial("udp", addr)
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.Write(packet)
	return err
}

func createMagicPacket(mac string) []byte {
	// สร้าง Magic Packet ตามมาตรฐาน
	// ตรงนี้จะมีการสร้าง packet ตามรูปแบบที่ต้องการ
	// ตัวอย่างเช่น สร้าง Magic Packet ตามมาตรฐาน Wake-on-LAN
	return []byte{}
}

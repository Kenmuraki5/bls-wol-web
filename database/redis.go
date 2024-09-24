package database

import (
	"context"
	"log"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() {
	redisAddr := "192.168.1.45:6379"
	RedisClient = redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
}

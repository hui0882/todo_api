package database

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"todo-api/internal/config"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() (*redis.Client, error) {
	cfg := config.Cfg.Redis

	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
		PoolSize: cfg.PoolSize,
	})
	if _, err := redisClient.Ping(Ctx).Result(); err != nil {
		return nil, err
	}
	return redisClient, nil
}

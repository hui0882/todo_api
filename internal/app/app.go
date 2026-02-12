package app

import (
	"time"
	"todo-api/internal/config"
	"todo-api/internal/constants"
	"todo-api/internal/database"
	"todo-api/internal/logger"
	"todo-api/internal/middleware"
	"todo-api/internal/middleware/session"
	"todo-api/router"

	"github.com/gin-gonic/gin"
)

func SetUp() *gin.Engine {
	logger.InitLogger()

	if err := database.InitMysql(); err != nil {
		panic(err)
	}

	rdb, err := database.InitRedis()
	if err != nil {
		panic(err)
	}

	// 从配置中读取session配置
	sessionTTL := time.Duration(config.Cfg.Redis.SessionMaxAge) * time.Second
	sessionPrefix := config.Cfg.Redis.SessionPrefix
	sessionManager := session.NewSessionManager(rdb, sessionTTL, sessionPrefix)

	r := gin.New()
	r.Use(middleware.RequestLogger())
	r.Use(middleware.GlobalException())
	r.Use(middleware.AuthMiddleware(sessionManager))

	// 将sessionManager注入到context中供controller使用
	r.Use(func(c *gin.Context) {
		c.Set(constants.ContextKeySessionManager, sessionManager)
		c.Next()
	})

	router.RegisterRouter(r)
	return r
}

package app

import (
	"todo-api/internal/logger"
	"todo-api/internal/middleware"
	"todo-api/router"

	"github.com/gin-gonic/gin"
)

func SetUp() *gin.Engine {
	logger.InitLogger()

	r := gin.New()
	r.Use(middleware.RequestLogger())
	r.Use(middleware.GlobalException())

	router.RegisterRouter(r)
	return r
}

package main

import (
	"log"
	_ "todo-api/docs"
	"todo-api/router"

	"github.com/gin-gonic/gin"
)

func main() {
	// 检查是否成功加载了 docs 包（通过编译期检查）
	log.Println("✅ Server starting...")

	gin.SetMode(gin.DebugMode)
	r := router.SetupRouter()
	r.Use(gin.Recovery())
	r.Run(":8080")
}

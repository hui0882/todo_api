package main

import (
	"todo-api/internal/app"
	"todo-api/internal/config"
	"todo-api/internal/logger"
)

func main() {
	// 读取配置信息
	config.LoadConfig()
	engine := app.SetUp()
	if err := engine.Run(":8080"); err != nil {
		logger.Logger.Println("项目启动失败")
	}
}

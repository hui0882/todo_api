package main

import (
	"todo-api/internal/app"
	"todo-api/internal/logger"
)

func main() {
	engine := app.SetUp()
	if err := engine.Run(":8080"); err != nil {
		logger.Logger.Println("项目启动失败")
	}
}

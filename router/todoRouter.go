package router

import (
	"github.com/gin-gonic/gin"
	"todo-api/controller"
)

func registerTodoRouter(router *gin.RouterGroup) {
	todoRouter := router.Group("todos")
	{
		todoRouter.POST("/create", controller.CreateTodo)
		todoRouter.GET("/list", controller.GetTodoList)
		todoRouter.GET("/:id", controller.GetTodoDetail)
		todoRouter.PUT("/:id", controller.UpdateTodo)
		todoRouter.DELETE("/:id", controller.DeleteTodo)
	}
}

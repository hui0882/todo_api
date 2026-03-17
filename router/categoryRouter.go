package router

import (
	"github.com/gin-gonic/gin"
	"todo-api/controller"
)

func registerCategoryRouter(router *gin.RouterGroup) {
	r := router.Group("categories")
	{
		r.GET("/list", controller.GetCategoryList)
		r.POST("/create", controller.CreateCategory)
		r.PUT("/:id", controller.UpdateCategory)
		r.DELETE("/:id", controller.DeleteCategory)
	}
}

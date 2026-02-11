package router

import (
	"todo-api/controller"

	"github.com/gin-gonic/gin"
)

func registerTestRouter(router *gin.RouterGroup) {
	testGroup := router.Group("test")
	{
		testGroup.GET("/test", controller.Test)
		testGroup.GET("/test2", controller.Test2)
		testGroup.POST("/test3", controller.Test3)
	}
}

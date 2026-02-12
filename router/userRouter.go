package router

import (
	"github.com/gin-gonic/gin"
	"todo-api/controller"
)

func registerUserRouter(router *gin.RouterGroup) {
	userRouter := router.Group("user")
	{
		userRouter.POST("/register", controller.RegisterUser)
		userRouter.POST("/login", controller.LoginUser)
		userRouter.POST("/logout", controller.LogoutUser)
	}
}

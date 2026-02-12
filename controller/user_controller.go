package controller

import (
	"github.com/gin-gonic/gin"
	"todo-api/internal/logger"
	"todo-api/model/req"
	"todo-api/response"
	"todo-api/service"
)

func RegisterUser(c *gin.Context) {
	var userRegisterReq req.UserRegisterReq
	if err := c.ShouldBind(&userRegisterReq); err != nil {
		logger.Logger.Println("json 解析失败")
		response.FailWithCode(c, response.ServerError)
	}
	if err := service.CreateUser(userRegisterReq); err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, "注册成功")
}

func LoginUser(c *gin.Context) {
	var userLoginReq req.UserLoginReq
	if err := c.ShouldBind(&userLoginReq); err != nil {
		logger.Logger.Println("json解析失败")
		response.FailWithCode(c, response.ServerError)
	}
	if err := service.LoginUser(userLoginReq); err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, "登录成功")
}

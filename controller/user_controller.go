package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"todo-api/internal/constants"
	"todo-api/internal/logger"
	"todo-api/internal/middleware/session"
	"todo-api/model/req"
	"todo-api/response"
	"todo-api/service"
	"todo-api/utils"
)

func RegisterUser(c *gin.Context) {
	var userRegisterReq req.UserRegisterReq
	if err := c.ShouldBindJSON(&userRegisterReq); err != nil {
		logger.Logger.Println("json 解析失败:", err)
		response.FailWithCode(c, response.BadRequest)
		return
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
	if err := c.ShouldBindJSON(&userLoginReq); err != nil {
		logger.Logger.Println("json解析失败:", err)
		response.FailWithCode(c, response.BadRequest)
		return
	}

	userID, err := service.LoginUser(userLoginReq)
	if err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}

	// 获取session manager
	sessionMgr, exists := c.Get(constants.ContextKeySessionManager)
	if !exists {
		logger.Logger.Println("session manager未找到")
		response.FailWithCode(c, response.ServerError)
		return
	}

	// 创建session
	sessionID, err := sessionMgr.(session.SessionManager).CreateSession(c.Request.Context(), userID)
	if err != nil {
		logger.Logger.Println("创建session失败:", err)
		response.FailWithCode(c, response.SessionError)
		return
	}

	// 设置cookie
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(
		constants.CookieSessionID,
		sessionID,
		constants.DefaultSessionMaxAge,
		"/",
		"",
		true,
		true, // HttpOnly
	)

	response.Success(c, gin.H{
		"message": "登录成功",
		"user_id": userID,
	})
}

func LogoutUser(c *gin.Context) {
	sessionID, err := c.Cookie(constants.CookieSessionID)
	if err != nil {
		response.FailWithCode(c, response.Unauthorized)
		return
	}

	// 获取session manager
	sessionMgr, exists := c.Get(constants.ContextKeySessionManager)
	if !exists {
		logger.Logger.Println("session manager未找到")
		response.FailWithCode(c, response.ServerError)
		return
	}

	// 删除session
	if err := sessionMgr.(session.SessionManager).Delete(c.Request.Context(), sessionID); err != nil {
		logger.Logger.Println("删除session失败:", err)
	}

	// 清除cookie
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(
		constants.CookieSessionID,
		"",
		-1,
		"/",
		"",
		true,
		true,
	)

	response.Success(c, "退出登录成功")
}

func GetLoginUserID(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		logger.Logger.Println("从 session 中获取 userID 失败：", err)
	}
	response.Success(c, userID)
}

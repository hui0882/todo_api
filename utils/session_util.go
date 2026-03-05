package utils

import (
	"github.com/gin-gonic/gin"
	"todo-api/internal/constants"
	"todo-api/internal/logger"
	"todo-api/internal/middleware/session"
	"todo-api/response"
)

func GetLoginUserID(c *gin.Context) (string, error) {
	sessionID, err := c.Cookie(constants.CookieSessionID)
	if err != nil {
		response.FailWithCode(c, response.Unauthorized)
		return "", err
	}
	sessionManager, exists := c.Get(constants.ContextKeySessionManager)
	if !exists {
		logger.Logger.Println("session manager未找到")
		response.FailWithCode(c, response.ServerError)
		return "", err
	}
	userID, err := sessionManager.(session.SessionManager).GetSession(c.Request.Context(), sessionID)
	if err != nil {
		logger.Logger.Println("获取session失败:", err)
		response.FailWithCode(c, response.Unauthorized)
		return "", err
	}
	return userID, nil
}

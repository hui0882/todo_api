package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"todo-api/internal/constants"
	"todo-api/internal/middleware/session"
	"todo-api/response"
)

var whiteList = []string{
	"/health",
	"/api/v1/user/register",
	"/api/v1/user/login",
}

func AuthMiddleware(sessionMgr session.SessionManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path

		// 检查是否在白名单中
		for _, whitePath := range whiteList {
			if strings.HasPrefix(path, whitePath) {
				c.Next()
				return
			}
		}

		// 从cookie中获取session_id
		sessionID, err := c.Cookie(constants.CookieSessionID)
		if err != nil {
			response.FailWithCode(c, response.Unauthorized)
			c.Abort()
			return
		}

		// 验证session是否有效
		userID, err := sessionMgr.GetSession(c.Request.Context(), sessionID)
		if err != nil {
			response.FailWithCode(c, response.Unauthorized)
			c.Abort()
			return
		}

		// 刷新session过期时间
		if err := sessionMgr.RefreshSession(c.Request.Context(), sessionID); err != nil {
			// 刷新失败不影响本次请求
		}

		// 将用户ID存入上下文
		c.Set(constants.ContextKeyUserID, userID)
		c.Next()
	}
}

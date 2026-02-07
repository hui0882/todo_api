// internal/middleware/global_exception.go
package middleware

import (
	"todo-api/internal/logger"
	"todo-api/response"

	"github.com/gin-gonic/gin"
)

func GlobalException() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				logger.Logger.Printf("Recovered panic: %v", err)
				c.Abort()
				// 所有未预期的 panic 都返回 500

				response.Fail(c, 500, "服务器内部错误")
			}
		}()
		c.Next()
	}
}

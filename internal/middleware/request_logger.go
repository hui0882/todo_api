package middleware

import (
	"time"
	"todo-api/internal/logger"

	"github.com/gin-gonic/gin"
)

func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		c.Next()

		// 构造 Gin 风格的日志
		var param string
		if raw != "" {
			param = "?" + raw
		}
		end := time.Now()
		latency := end.Sub(start)
		clientIP := c.ClientIP()
		method := c.Request.Method
		statusCode := c.Writer.Status()
		comment := ""
		if len(c.Errors) > 0 {
			comment = c.Errors.String()
		}

		// 使用你的全局 Logger 输出
		logger.Logger.Printf(
			"[GIN] %3d | %13v | %15s | %-7s %s%s %s",
			statusCode,
			latency,
			clientIP,
			method,
			path,
			param,
			comment,
		)
	}
}

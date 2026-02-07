package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Result 统一响应结构
type Result struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data,omitempty"` // 成功时有数据，失败时为 null
}

// Success 返回成功响应
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Result{
		Code: ServerSuccess.code,
		Msg:  ServerSuccess.message,
		Data: data,
	})
}

// Fail 返回失败响应
func Fail(c *gin.Context, code int, msg string) {
	c.JSON(http.StatusOK, Result{
		Code: code,
		Msg:  msg,
		Data: nil,
	})
}

// FailWithCode 使用预定义错误码
func FailWithCode(c *gin.Context, errCode ErrorCoder) {
	Fail(c, errCode.Code(), errCode.Message())
}

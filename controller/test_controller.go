package controller

import (
	"todo-api/response"

	"github.com/gin-gonic/gin"
)

// Test godoc
// @Summary 测试接口
// @Tags Test
// @Produce json
// @Success 200 {object} map[string]string
// @Router /test/test [get]
func Test(c *gin.Context) {
	response.Success(c, "玛卡巴卡")
}

func Test2(c *gin.Context) {
	panic("error test")
}

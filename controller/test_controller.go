package controller

import (
	"todo-api/model/req"
	"todo-api/response"
	"todo-api/service"

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

func Test3(c *gin.Context) {
	var userReq req.UserReq
	if err := c.ShouldBind(&userReq); err != nil {
		response.Fail(c, 500, "请求解析失败")
		return
	}
	if err := service.CreateUser(userReq); err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, "注册成功")
}

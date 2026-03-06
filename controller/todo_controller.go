package controller

import (
	"github.com/gin-gonic/gin"
	"strconv"
	"todo-api/internal/logger"
	"todo-api/model/req"
	"todo-api/response"
	"todo-api/service"
	"todo-api/utils"
)

func CreateTodo(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		response.FailWithCode(c, response.Unauthorized)
		return
	}
	var todoReq req.TodoCreateReq
	if err := c.ShouldBindJSON(&todoReq); err != nil {
		logger.Logger.Println("json 解析失败：", err)
		response.FailWithCode(c, response.BadRequest)
		return
	}

	todo, err := service.CreateTodo(userID, todoReq)
	if err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, todo)
}

func GetTodoList(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		return
	}

	var listReq req.TodoListReq
	if err := c.ShouldBindQuery(&listReq); err != nil {
		logger.Logger.Println("参数解析失败：", err)
		response.FailWithCode(c, response.BadRequest)
		return
	}

	todos, total, err := service.GetTodoList(userID, listReq)
	if err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, gin.H{
		"list":  todos,
		"total": total,
	})
}

func GetTodoDetail(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.FailWithCode(c, response.BadRequest)
		return
	}

	todo, err := service.GetTodoDetail(userID, id)
	if err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, todo)
}

func UpdateTodo(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.FailWithCode(c, response.BadRequest)
		return
	}

	var updateReq req.TodoUpdateReq
	if err := c.ShouldBindJSON(&updateReq); err != nil {
		logger.Logger.Println("json 解析失败:", err)
		response.FailWithCode(c, response.BadRequest)
		return
	}

	if err := service.UpdateTodo(userID, id, updateReq); err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, "更新成功")
}

func DeleteTodo(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.FailWithCode(c, response.BadRequest)
		return
	}

	if err := service.DeleteTodo(userID, id); err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, "删除成功")
}

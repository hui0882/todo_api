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

// GetCategoryList 获取分类列表
func GetCategoryList(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		return
	}

	categories, err := service.GetCategoryList(userID)
	if err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, categories)
}

// CreateCategory 创建分类
func CreateCategory(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		return
	}

	var createReq req.CategoryCreateReq
	if err := c.ShouldBindJSON(&createReq); err != nil {
		logger.Logger.Println("json 解析失败：", err)
		response.FailWithCode(c, response.BadRequest)
		return
	}

	category, err := service.CreateCategory(userID, createReq)
	if err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, category)
}

// UpdateCategory 更新分类
func UpdateCategory(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.FailWithCode(c, response.BadRequest)
		return
	}

	var updateReq req.CategoryUpdateReq
	if err := c.ShouldBindJSON(&updateReq); err != nil {
		logger.Logger.Println("json 解析失败：", err)
		response.FailWithCode(c, response.BadRequest)
		return
	}

	if err := service.UpdateCategory(userID, id, updateReq); err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, "更新成功")
}

// DeleteCategory 删除分类
func DeleteCategory(c *gin.Context) {
	userID, err := utils.GetLoginUserID(c)
	if err != nil {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.FailWithCode(c, response.BadRequest)
		return
	}

	if err := service.DeleteCategory(userID, id); err != nil {
		if e, ok := err.(response.ErrorCoder); ok {
			response.FailWithCode(c, e)
		} else {
			response.FailWithCode(c, response.ServerError)
		}
		return
	}
	response.Success(c, "删除成功")
}

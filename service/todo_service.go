package service

import (
	"strconv"
	"todo-api/internal/logger"
	"todo-api/model"
	"todo-api/model/dao"
	"todo-api/model/req"
	"todo-api/response"
)

func CreateTodo(userID string, todoReq req.TodoCreateReq) (*model.Todo, error) {
	uid, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		logger.Logger.Println("userID 解析失败：", err)
		return nil, response.ServerError
	}

	todo := &model.Todo{
		UserID:      uid,
		Title:       todoReq.Title,
		Description: todoReq.Description,
		DueDate:     todoReq.DueDate,
	}
	if todoReq.Priority != nil {
		todo.Priority = *todoReq.Priority
	}

	if err := dao.CreateTodo(todo); err != nil {
		logger.Logger.Println("创建待办失败", err)
		return nil, response.DatabaseError
	}

	return todo, nil
}

func GetTodoList(userID string, listReq req.TodoListReq) ([]model.Todo, int64, error) {
	uid, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		return nil, 0, response.ServerError
	}

	// 分页默认值
	page := listReq.Page
	size := listReq.Size
	if page <= 0 {
		page = 1
	}
	if size <= 0 || size > 100 {
		size = 10
	}
	offset := (page - 1) * size

	todos, total, err := dao.GetTodoList(uid, listReq.Status, offset, size)
	if err != nil {
		logger.Logger.Println("查询列表失败：", err)
		return nil, 0, response.DatabaseError
	}
	return todos, total, nil
}

func GetTodoDetail(userID string, todoID uint64) (*model.Todo, error) {
	uid, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		return nil, response.ServerError
	}

	todo, err := dao.GetTodoById(todoID, uid)
	if err != nil {
		return nil, response.NotFound
	}
	return todo, nil
}

func UpdateTodo(userID string, todoID uint64, updateReq req.TodoUpdateReq) error {
	uid, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		return response.ServerError
	}

	updates := make(map[string]interface{})
	if updateReq.Title != nil {
		updates["title"] = *updateReq.Title
	}
	if updateReq.Description != nil {
		updates["description"] = *updateReq.Description
	}
	if updateReq.Status != nil {
		updates["status"] = *updateReq.Status
	}
	if updateReq.Priority != nil {
		updates["priority"] = *updateReq.Priority
	}
	if updateReq.DueDate != nil {
		updates["due_date"] = *updateReq.DueDate
	}

	if len(updates) == 0 {
		return response.BadRequest
	}

	if err := dao.UpdateTodo(todoID, uid, updates); err != nil {
		return response.ServerError
	}
	return nil
}

func DeleteTodo(userID string, todoID uint64) error {
	uid, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		return response.ServerError
	}

	if err := dao.DeleteTodo(todoID, uid); err != nil {
		logger.Logger.Println("删除待办失败：", err)
		return response.DatabaseError
	}
	return nil
}

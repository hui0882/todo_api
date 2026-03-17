package dao

import (
	"todo-api/internal/database"
	"todo-api/model"
)

func CreateTodo(todo *model.Todo) error {
	return database.Db.Create(todo).Error
}

func GetTodoById(id uint64, userID uint64) (*model.Todo, error) {
	var todo model.Todo
	err := database.Db.Where("id = ? AND user_id = ?", id, userID).First(&todo).Error
	return &todo, err
}

func GetTodoList(userID uint64, status *int8, categoryID *uint64, offset, limit int) ([]model.Todo, int64, error) {
	var todos []model.Todo
	var total int64

	query := database.Db.Model(&model.Todo{}).Where("user_id = ?", userID)
	if status != nil {
		query = query.Where("status = ?", *status)
	}
	if categoryID != nil {
		query = query.Where("category_id = ?", *categoryID)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Preload("Category").Order("created_at DESC").Offset(offset).Limit(limit).Find(&todos).Error
	return todos, total, err
}

func UpdateTodo(id, userID uint64, updates map[string]interface{}) error {
	return database.Db.Model(&model.Todo{}).
		Where("id = ? and user_id = ?", id, userID).
		Updates(updates).Error
}

func DeleteTodo(id, userID uint64) error {
	return database.Db.Where("id = ? and user_id = ?", id, userID).
		Delete(&model.Todo{}).Error
}

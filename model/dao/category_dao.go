package dao

import (
	"todo-api/internal/database"
	"todo-api/model"
)

// GetCategoryList 获取用户可见的所有分类（包括系统预置 user_id=0 和用户自建）
func GetCategoryList(userID uint64) ([]model.Category, error) {
	var categories []model.Category
	err := database.Db.
		Where("user_id IN (0, ?)", userID).
		Order("sort_order ASC, id ASC").
		Find(&categories).Error
	return categories, err
}

// CreateCategory 创建分类
func CreateCategory(c *model.Category) error {
	return database.Db.Create(c).Error
}

// GetCategoryByIDAndUser 按 ID 获取分类（允许查预置分类和本人分类）
func GetCategoryByIDAndUser(id, userID uint64) (*model.Category, error) {
	var category model.Category
	err := database.Db.
		Where("id = ? AND (user_id = ? OR user_id = 0)", id, userID).
		First(&category).Error
	return &category, err
}

// UpdateCategory 更新用户自建分类（仅允许操作 user_id=userID 的记录）
func UpdateCategory(id, userID uint64, updates map[string]interface{}) error {
	return database.Db.Model(&model.Category{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(updates).Error
}

// DeleteCategory 删除用户自建分类（仅允许操作 user_id=userID 的记录）
func DeleteCategory(id, userID uint64) error {
	return database.Db.
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&model.Category{}).Error
}

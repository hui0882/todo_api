package service

import (
	"strconv"
	"todo-api/internal/logger"
	"todo-api/model"
	"todo-api/model/dao"
	"todo-api/model/req"
	"todo-api/response"
)

// GetCategoryList 获取用户可见分类列表
func GetCategoryList(userIDStr string) ([]model.Category, error) {
	uid, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		return nil, response.ServerError
	}

	categories, err := dao.GetCategoryList(uid)
	if err != nil {
		logger.Logger.Println("查询分类列表失败：", err)
		return nil, response.DatabaseError
	}
	return categories, nil
}

// CreateCategory 创建用户自建分类
func CreateCategory(userIDStr string, r req.CategoryCreateReq) (*model.Category, error) {
	uid, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		return nil, response.ServerError
	}

	category := &model.Category{
		UserID: uid,
		Name:   r.Name,
		Color:  "#1677ff",
		Icon:   r.Icon,
	}
	if r.Color != nil {
		category.Color = *r.Color
	}
	if r.SortOrder != nil {
		category.SortOrder = *r.SortOrder
	}

	if err := dao.CreateCategory(category); err != nil {
		logger.Logger.Println("创建分类失败：", err)
		return nil, response.DatabaseError
	}
	return category, nil
}

// UpdateCategory 更新用户自建分类（预置分类不可修改）
func UpdateCategory(userIDStr string, id uint64, r req.CategoryUpdateReq) error {
	uid, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		return response.ServerError
	}

	// 查询分类是否存在且可访问
	category, err := dao.GetCategoryByIDAndUser(id, uid)
	if err != nil {
		return response.CategoryNotFound
	}

	// 预置分类不可修改
	if category.IsPreset {
		return response.PresetNotEditable
	}

	// 非本人分类不可修改
	if category.UserID != uid {
		return response.CategoryForbidden
	}

	updates := make(map[string]interface{})
	if r.Name != nil {
		updates["name"] = *r.Name
	}
	if r.Color != nil {
		updates["color"] = *r.Color
	}
	if r.Icon != nil {
		updates["icon"] = *r.Icon
	}
	if r.SortOrder != nil {
		updates["sort_order"] = *r.SortOrder
	}

	if len(updates) == 0 {
		return response.BadRequest
	}

	if err := dao.UpdateCategory(id, uid, updates); err != nil {
		logger.Logger.Println("更新分类失败：", err)
		return response.DatabaseError
	}
	return nil
}

// DeleteCategory 删除用户自建分类（预置分类不可删除）
func DeleteCategory(userIDStr string, id uint64) error {
	uid, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		return response.ServerError
	}

	// 查询分类是否存在且可访问
	category, err := dao.GetCategoryByIDAndUser(id, uid)
	if err != nil {
		return response.CategoryNotFound
	}

	// 预置分类不可删除
	if category.IsPreset {
		return response.PresetNotEditable
	}

	// 非本人分类不可删除
	if category.UserID != uid {
		return response.CategoryForbidden
	}

	if err := dao.DeleteCategory(id, uid); err != nil {
		logger.Logger.Println("删除分类失败：", err)
		return response.DatabaseError
	}
	return nil
}

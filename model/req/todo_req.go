package req

import "time"

// TodoCreateReq 创建待办请求
type TodoCreateReq struct {
	Title       string     `json:"title" binding:"required"`
	Description *string    `json:"description"`
	Priority    *int8      `json:"priority"`    // 0=普通，1=重要，2=紧急，不传默认0
	DueDate     *time.Time `json:"due_date"`    // 截止日期，可选
	CategoryID  *uint64    `json:"category_id"` // 所属分类ID，可选
}

// TodoUpdateReq 更新待办请求
type TodoUpdateReq struct {
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	Status      *int8      `json:"status"` // 0=未完成，1=已完成
	Priority    *int8      `json:"priority"`
	DueDate     *time.Time `json:"due_date"`
	CategoryID  *uint64    `json:"category_id"` // 所属分类ID，可选
}

// TodoListReq 查询待办列表请求（支持分页和状态过滤）
type TodoListReq struct {
	Status     *int8   `form:"status"`      // 不传则查全部
	CategoryID *uint64 `form:"category_id"` // 按分类过滤，可选
	Page       int     `form:"page"`
	Size       int     `form:"size"`
}

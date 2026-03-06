package model

import "time"

type Todo struct {
	ID     uint64 `gorm:"primaryKey;autoIncrement;comment:待办事项唯一ID" json:"id"`
	UserID uint64 `gorm:"not null;index:idx_user_id;comment:所属用户ID" json:"user_id"`

	Title       string  `gorm:"type:varchar(255);not null;comment:待办事项标题" json:"title"`
	Description *string `gorm:"type:text;comment:详细描述" json:"description"`

	Status   int8 `gorm:"type:tinyint;default:0;not null;comment:状态：0=未完成，1=已完成" json:"status"`
	Priority int8 `gorm:"type:tinyint;default:0;not null;comment:优先级：0=普通，1=重要，2=紧急" json:"priority"`

	DueDate *time.Time `gorm:"comment:截止日期" json:"due_date"`

	CreatedAt time.Time `gorm:"autoCreateTime;comment:创建时间" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime;comment:最后更新时间" json:"updated_at"`

	// 关联
	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
}

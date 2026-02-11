package model

import "time"

type Todo struct {
	ID     uint64 `gorm:"primaryKey;autoIncrement;comment:待办事项唯一ID"`
	UserID uint64 `gorm:"not null;index:idx_user_id;comment:所属用户ID"`

	Title       string  `gorm:"type:varchar(255);not null;comment:待办事项标题"`
	Description *string `gorm:"type:text;comment:详细描述"`

	Status   int8 `gorm:"type:tinyint;default:0;not null;comment:状态：0=未完成，1=已完成"`
	Priority int8 `gorm:"type:tinyint;default:0;not null;comment:优先级：0=普通，1=重要，2=紧急"`

	DueDate *time.Time `gorm:"comment:截止日期"`

	CreatedAt time.Time `gorm:"autoCreateTime;comment:创建时间"`
	UpdatedAt time.Time `gorm:"autoUpdateTime;comment:最后更新时间"`

	// 关联
	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

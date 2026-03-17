package model

import "time"

type Category struct {
	ID        uint64  `gorm:"primaryKey;autoIncrement;comment:分类唯一ID" json:"id"`
	UserID    uint64  `gorm:"not null;default:0;index:idx_user_id;comment:所属用户ID" json:"user_id"`
	Name      string  `gorm:"type:varchar(50);not null;comment:分类名称" json:"name"`
	Color     string  `gorm:"type:varchar(20);not null;default:'#1677ff';comment:颜色" json:"color"`
	Icon      *string `gorm:"type:varchar(50);comment:图标名" json:"icon"`
	SortOrder int     `gorm:"default:0;not null;comment:排序权重" json:"sort_order"`
	IsPreset  bool    `gorm:"type:tinyint(1);not null;default:0;comment:是否预置" json:"is_preset"`

	CreatedAt time.Time `gorm:"autoCreateTime;comment:创建时间" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime;comment:最后更新时间" json:"updated_at"`
}

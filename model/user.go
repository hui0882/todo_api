package model

import (
	"time"
)

type User struct {
	ID           uint64  `gorm:"primaryKey;autoIncrement;comment:用户唯一ID"`
	Username     string  `gorm:"type:varchar(50);not null;uniqueIndex:uk_username;comment:用户名（用于登录）"`
	PasswordHash string  `gorm:"type:varchar(255);not null;comment:密码哈希值（bcrypt加密后）"`
	Email        *string `gorm:"type:varchar(100);uniqueIndex:uk_email;comment:邮箱（可选）"`

	CreatedAt time.Time `gorm:"autoCreateTime;comment:账号创建时间"`
	UpdatedAt time.Time `gorm:"autoUpdateTime;comment:最后更新时间"`
}

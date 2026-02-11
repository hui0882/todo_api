package dao

import (
	"todo-api/internal/database"
	"todo-api/model"
)

func CreateUser(user *model.User) error {
	return database.Db.Create(user).Error
}

func GetUserByUsername(username string) (*model.User, error) {
	var user model.User
	err := database.Db.
		Where("username = ?", username).
		First(&user).Error
	return &user, err
}

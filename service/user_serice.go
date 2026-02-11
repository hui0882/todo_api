package service

import (
	"todo-api/model"
	"todo-api/model/dao"
	"todo-api/model/req"
	"todo-api/response"
)

func CreateUser(userReq req.UserReq) error {
	_, err := dao.GetUserByUsername(userReq.Username)
	if err == nil {
		return response.AuthorExistError
	}

	user := model.User{
		Username:     userReq.Username,
		PasswordHash: userReq.Password,
	}
	return dao.CreateUser(&user)
}

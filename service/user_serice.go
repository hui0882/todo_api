package service

import (
	"todo-api/internal/logger"
	"todo-api/model"
	"todo-api/model/dao"
	"todo-api/model/req"
	"todo-api/response"
	"todo-api/utils"
)

func CreateUser(userReq req.UserRegisterReq) error {
	_, err := dao.GetUserByUsername(userReq.Username)
	if err == nil {
		return response.AuthorExistError
	}

	hashedPassword, err := utils.GetHashPassword(userReq.Password)
	if err != nil {
		logger.Logger.Println("加密失败", err)
		return response.ServerError
	}

	user := model.User{
		Username:     userReq.Username,
		PasswordHash: hashedPassword,
	}
	return dao.CreateUser(&user)
}

func LoginUser(userLoginReq req.UserLoginReq) error {
	user, err := dao.GetUserByUsername(userLoginReq.Username)
	if err != nil {
		logger.Logger.Println("输入的账号或密码错误")
		return response.Unauthorized
	}

	// 检查密码正确性
	if !utils.CheckPassword(userLoginReq.Password, user.PasswordHash) {
		logger.Logger.Println("密码错误")
		return response.Unauthorized
	}

	return nil
}

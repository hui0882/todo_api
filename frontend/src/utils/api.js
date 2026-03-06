import request from '../utils/request';
import { getEndpoint } from '../config/api';

// 用户注册
export const register = (data) => {
  return request({
    url: getEndpoint('register'),
    method: 'POST',
    data,
  });
};

// 用户登录
export const login = (data) => {
  return request({
    url: getEndpoint('login'),
    method: 'POST',
    data,
  });
};

// 退出登录
export const logout = () => {
  return request({
    url: getEndpoint('logout'),
    method: 'POST',
  });
};

// 获取 TODO 列表
export const getTodos = () => {
  return request({
    url: getEndpoint('getTodos'),
    method: 'GET',
  });
};

// 创建 TODO
export const createTodo = (data) => {
  return request({
    url: getEndpoint('createTodo'),
    method: 'POST',
    data,
  });
};

// 更新 TODO
export const updateTodo = (id, data) => {
  return request({
    url: getEndpoint('updateTodo', { id }),
    method: 'PUT',
    data,
  });
};

// 删除 TODO
export const deleteTodo = (id) => {
  return request({
    url: getEndpoint('deleteTodo', { id }),
    method: 'DELETE',
  });
};

// 健康检查
export const healthCheck = () => {
  return request({
    url: getEndpoint('health'),
    method: 'GET',
  });
};

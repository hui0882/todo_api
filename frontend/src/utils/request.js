import axios from 'axios';
import { message } from 'antd';
import { getApiConfig } from '../config/api';

// 创建 axios 实例
const request = axios.create({
  timeout: 10000,
  withCredentials: true, // 携带 cookie
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 动态设置 baseURL
    const apiConfig = getApiConfig();
    config.baseURL = apiConfig.baseURL;

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response;

    // 根据后端返回的数据结构判断
    if (data.code === 200) {
      return data;
    } else {
      // 业务错误
      message.error(data.msg || '请求失败');
      return Promise.reject(new Error(data.msg || '请求失败'));
    }
  },
  (error) => {
    // HTTP 错误
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          message.error('未登录或登录已过期，请重新登录');
          // 跳转到登录页
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error(data?.msg || '服务器错误');
          break;
        default:
          message.error(data?.msg || '请求失败');
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error(error.message || '请求失败');
    }

    return Promise.reject(error);
  }
);

export default request;

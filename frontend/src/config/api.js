// 默认 API 配置
const DEFAULT_API_CONFIG = {
  baseURL: 'http://localhost:8080',
  endpoints: {
    // 用户相关
    register: '/api/v1/user/register',
    login: '/api/v1/user/login',
    logout: '/api/v1/user/logout',

    // TODO 相关
    getTodos: '/api/v1/todos',
    createTodo: '/api/v1/todos',
    updateTodo: '/api/v1/todos/:id',
    deleteTodo: '/api/v1/todos/:id',

    // 健康检查
    health: '/health'
  }
};

// 从 localStorage 获取配置
export const getApiConfig = () => {
  const saved = localStorage.getItem('apiConfig');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse API config:', e);
    }
  }
  return DEFAULT_API_CONFIG;
};

// 保存配置到 localStorage
export const saveApiConfig = (config) => {
  localStorage.setItem('apiConfig', JSON.stringify(config));
};

// 获取完整 URL
export const getFullUrl = (endpointKey, params = {}) => {
  const config = getApiConfig();
  let endpoint = config.endpoints[endpointKey] || '';

  // 替换路径参数
  Object.keys(params).forEach(key => {
    endpoint = endpoint.replace(`:${key}`, params[key]);
  });

  return config.baseURL + endpoint;
};

// 重置为默认配置
export const resetApiConfig = () => {
  localStorage.removeItem('apiConfig');
  return DEFAULT_API_CONFIG;
};

export default DEFAULT_API_CONFIG;

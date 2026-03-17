// 默认 API 配置
const DEFAULT_API_CONFIG = {
  baseURL: 'http://localhost:8080',
  endpoints: {
    // 用户相关
    register: '/api/v1/user/register',
    login: '/api/v1/user/login',
    logout: '/api/v1/user/logout',

    // TODO 相关
    getTodos: '/api/v1/todos/list',
    createTodo: '/api/v1/todos/create',
    updateTodo: '/api/v1/todos/:id',
    deleteTodo: '/api/v1/todos/:id',

    // 分类相关
    getCategories:  '/api/v1/categories/list',
    createCategory: '/api/v1/categories/create',
    updateCategory: '/api/v1/categories/:id',
    deleteCategory: '/api/v1/categories/:id',

    // 健康检查
    health: '/health'
  }
};

// 从 localStorage 获取配置，若 endpoints 缺失则用默认值补全
export const getApiConfig = () => {
  const saved = localStorage.getItem('apiConfig');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        baseURL: parsed.baseURL || DEFAULT_API_CONFIG.baseURL,
        endpoints: { ...DEFAULT_API_CONFIG.endpoints, ...(parsed.endpoints || {}) },
      };
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

// 获取接口路径（不含 baseURL，由 axios 实例的 baseURL 统一处理）
export const getEndpoint = (endpointKey, params = {}) => {
  const config = getApiConfig();
  let endpoint = config.endpoints[endpointKey] || '';

  // 替换路径参数
  Object.keys(params).forEach(key => {
    endpoint = endpoint.replace(`:${key}`, params[key]);
  });

  return endpoint;
};

// 重置为默认配置
export const resetApiConfig = () => {
  localStorage.removeItem('apiConfig');
  return DEFAULT_API_CONFIG;
};

export default DEFAULT_API_CONFIG;

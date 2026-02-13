import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Space,
  message,
  Divider,
  Typography,
  Tag,
  Popconfirm,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoginOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getApiConfig, saveApiConfig, resetApiConfig } from '../config/api';
import { healthCheck } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const config = getApiConfig();
    form.setFieldsValue({
      baseURL: config.baseURL,
      ...config.endpoints,
    });
  }, [form]);

  // 保存配置
  const handleSave = (values) => {
    const { baseURL, ...endpoints } = values;

    const newConfig = {
      baseURL,
      endpoints,
    };

    saveApiConfig(newConfig);
    message.success('配置已保存');
  };

  // 重置配置
  const handleReset = () => {
    const defaultConfig = resetApiConfig();
    form.setFieldsValue({
      baseURL: defaultConfig.baseURL,
      ...defaultConfig.endpoints,
    });
    message.success('已重置为默认配置');
  };

  // 测试连接
  const handleTest = async () => {
    setLoading(true);
    setTestStatus(null);
    try {
      await healthCheck();
      setTestStatus('success');
      message.success('连接测试成功');
    } catch (error) {
      setTestStatus('error');
      message.error('连接测试失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm flex items-center justify-between px-6">
        <div className="flex items-center">
          <div className="text-xl font-bold text-gray-800">API 配置</div>
        </div>
        <Space>
          {isAuthenticated ? (
            <Button
              type="text"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              返回首页
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              去登录
            </Button>
          )}
        </Space>
      </Header>

      <Content className="p-6">
        <div className="max-w-4xl mx-auto">
          <Alert
            message="提示"
            description="你可以在登录前配置 API 地址，确保后端地址正确后再进行登录。"
            type="info"
            showIcon
            closable
            className="mb-4"
          />

          <Card>
            <div className="mb-6">
              <Title level={4}>配置说明</Title>
              <Text type="secondary">
                在这里可以自定义所有 API 接口的地址。修改后请保存并测试连接。
                路径参数使用 <Text code>:id</Text> 格式表示。
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
            >
              <Divider>基础配置</Divider>

              <Form.Item
                name="baseURL"
                label="服务器地址"
                rules={[{ required: true, message: '请输入服务器地址' }]}
              >
                <Input
                  placeholder="http://localhost:8080"
                  addonAfter={
                    <Space>
                      {testStatus === 'success' && (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          连接正常
                        </Tag>
                      )}
                      {testStatus === 'error' && (
                        <Tag icon={<CloseCircleOutlined />} color="error">
                          连接失败
                        </Tag>
                      )}
                      <Button
                        type="link"
                        size="small"
                        onClick={handleTest}
                        loading={loading}
                      >
                        测试连接
                      </Button>
                    </Space>
                  }
                />
              </Form.Item>

              <Divider>用户接口</Divider>

              <Form.Item
                name="register"
                label="注册接口"
                rules={[{ required: true, message: '请输入注册接口路径' }]}
              >
                <Input placeholder="/api/v1/user/register" />
              </Form.Item>

              <Form.Item
                name="login"
                label="登录接口"
                rules={[{ required: true, message: '请输入登录接口路径' }]}
              >
                <Input placeholder="/api/v1/user/login" />
              </Form.Item>

              <Form.Item
                name="logout"
                label="退出登录接口"
                rules={[{ required: true, message: '请输入退出登录接口路径' }]}
              >
                <Input placeholder="/api/v1/user/logout" />
              </Form.Item>

              <Divider>待办事项接口</Divider>

              <Form.Item
                name="getTodos"
                label="获取待办列表"
                rules={[{ required: true, message: '请输入获取待办列表接口路径' }]}
              >
                <Input placeholder="/api/v1/todos" />
              </Form.Item>

              <Form.Item
                name="createTodo"
                label="创建待办"
                rules={[{ required: true, message: '请输入创建待办接口路径' }]}
              >
                <Input placeholder="/api/v1/todos" />
              </Form.Item>

              <Form.Item
                name="updateTodo"
                label="更新待办"
                rules={[{ required: true, message: '请输入更新待办接口路径' }]}
              >
                <Input placeholder="/api/v1/todos/:id" />
              </Form.Item>

              <Form.Item
                name="deleteTodo"
                label="删除待办"
                rules={[{ required: true, message: '请输入删除待办接口路径' }]}
              >
                <Input placeholder="/api/v1/todos/:id" />
              </Form.Item>

              <Divider>其他接口</Divider>

              <Form.Item
                name="health"
                label="健康检查"
                rules={[{ required: true, message: '请输入健康检查接口路径' }]}
              >
                <Input placeholder="/health" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                  >
                    保存配置
                  </Button>
                  <Popconfirm
                    title="确定重置为默认配置？"
                    onConfirm={handleReset}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button icon={<ReloadOutlined />}>
                      重置为默认
                    </Button>
                  </Popconfirm>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default SettingsPage;

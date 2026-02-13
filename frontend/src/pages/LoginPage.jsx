import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // 登录
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await login({
        username: values.username,
        password: values.password,
      });
      message.success('登录成功');
      loginUser({ username: values.username, user_id: res.data?.user_id });
      navigate('/');
    } catch (error) {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      await register({
        username: values.username,
        password: values.password,
        email: values.email || undefined,
      });
      message.success('注册成功，请登录');
      setActiveTab('login');
    } catch (error) {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <Form onFinish={handleLogin} autoComplete="off">
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="密码"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );

  const registerForm = (
    <Form onFinish={handleRegister} autoComplete="off">
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, message: '用户名至少3个字符' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6个字符' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="密码"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="confirm"
        dependencies={['password']}
        rules={[
          { required: true, message: '请确认密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="确认密码"
          size="large"
        />
      </Form.Item>
      <Form.Item name="email">
        <Input
          prefix={<MailOutlined />}
          placeholder="邮箱（可选）"
          size="large"
          type="email"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          注册
        </Button>
      </Form.Item>
    </Form>
  );

  const items = [
    {
      key: 'login',
      label: '登录',
      children: loginForm,
    },
    {
      key: 'register',
      label: '注册',
      children: registerForm,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute top-4 right-4">
        <Button
          icon={<SettingOutlined />}
          onClick={() => navigate('/settings')}
          size="large"
        >
          API 配置
        </Button>
      </div>
      <Card
        className="w-full max-w-md shadow-lg"
        title={
          <div className="text-center text-2xl font-bold text-gray-800">
            TODO 管理系统
          </div>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          centered
        />
      </Card>
    </div>
  );
};

export default LoginPage;

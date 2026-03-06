import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  List,
  Modal,
  Form,
  Input,
  Checkbox,
  Space,
  message,
  Popconfirm,
  Tag,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, updateTodo, deleteTodo, logout } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content } = Layout;
const { TextArea } = Input;

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  // 加载 TODO 列表
  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await getTodos();
      setTodos(res.data?.list || []);
    } catch (error) {
      // 如果是 401 错误，会在拦截器中自动跳转登录页
      if (error.response?.status !== 401) {
        message.error('加载待办事项失败');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // 打开新建/编辑弹窗
  const openModal = (todo = null) => {
    setEditingTodo(todo);
    if (todo) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        completed: todo.status === 1,
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 关闭弹窗
  const closeModal = () => {
    setModalVisible(false);
    setEditingTodo(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingTodo) {
        // 更新：将 completed 布尔转换为 status 整型
        const { completed, ...rest } = values;
        await updateTodo(editingTodo.id, { ...rest, status: completed ? 1 : 0 });
        message.success('更新成功');
      } else {
        // 创建：后端创建接口不需要 completed 字段
        const { completed, ...createData } = values;
        await createTodo(createData);
        message.success('创建成功');
      }
      closeModal();
      loadTodos();
    } catch (error) {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false);
    }
  };

  // 删除 TODO
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteTodo(id);
      message.success('删除成功');
      loadTodos();
    } catch (error) {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false);
    }
  };

  // 切换完成状态
  const toggleCompleted = async (todo) => {
    try {
      const newStatus = todo.status === 1 ? 0 : 1;
      await updateTodo(todo.id, { status: newStatus });
      loadTodos();
    } catch (error) {
      // 错误已在拦截器中处理
    }
  };

  // 退出登录
  const handleLogout = async () => {
    try {
      await logout();
      logoutUser();
      message.success('退出登录成功');
      navigate('/login');
    } catch (error) {
      // 即使失败也清除本地状态
      logoutUser();
      navigate('/login');
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm flex items-center justify-between px-6">
        <div className="text-xl font-bold text-gray-800">TODO 管理系统</div>
        <Space>
          <span className="text-gray-600">欢迎, {user?.username}</span>
          <Button
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/stress-test')}
          >
            压测
          </Button>
          <Button
            icon={<SettingOutlined />}
            onClick={() => navigate('/settings')}
          >
            设置
          </Button>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
          >
            退出
          </Button>
        </Space>
      </Header>

      <Content className="p-6">
        <Card
          title="我的待办事项"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
            >
              新建
            </Button>
          }
        >
          <List
            loading={loading}
            dataSource={todos}
            locale={{
              emptyText: (
                <Empty description="暂无待办事项">
                  <Button type="primary" onClick={() => openModal()}>
                    创建第一个待办
                  </Button>
                </Empty>
              ),
            }}
            renderItem={(todo) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => openModal(todo)}
                  >
                    编辑
                  </Button>,
                  <Popconfirm
                    title="确定删除这个待办事项？"
                    onConfirm={() => handleDelete(todo.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Checkbox
                      checked={todo.status === 1}
                      onChange={() => toggleCompleted(todo)}
                    />
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          todo.status === 1
                            ? 'line-through text-gray-400'
                            : 'text-gray-800'
                        }
                      >
                        {todo.title}
                      </span>
                      {todo.status === 1 && (
                        <Tag color="success">已完成</Tag>
                      )}
                    </div>
                  }
                  description={
                    <span
                      className={
                        todo.status === 1
                          ? 'line-through text-gray-300'
                          : 'text-gray-600'
                      }
                    >
                      {todo.description}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Modal
          title={editingTodo ? '编辑待办' : '新建待办'}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{ completed: false }}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="请输入待办标题" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <TextArea
                placeholder="请输入待办描述（可选）"
                rows={4}
              />
            </Form.Item>
            <Form.Item name="completed" valuePropName="checked">
              <Checkbox>已完成</Checkbox>
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={closeModal}>取消</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingTodo ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default TodoPage;

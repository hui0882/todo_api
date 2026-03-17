import React, { useState, useEffect, useMemo } from 'react';
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
  DatePicker,
  Tabs,
  Select,
  Divider,
  Drawer,
  Badge,
  Tooltip,
  Grid,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  logout,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

// 预设颜色选项
const COLOR_OPTIONS = [
  { value: '#1677ff', label: '蓝色' },
  { value: '#52c41a', label: '绿色' },
  { value: '#fa8c16', label: '橙色' },
  { value: '#eb2f96', label: '粉色' },
  { value: '#722ed1', label: '紫色' },
  { value: '#13c2c2', label: '青色' },
  { value: '#f5222d', label: '红色' },
  { value: '#fadb14', label: '黄色' },
  { value: '#8c8c8c', label: '灰色' },
  { value: '#000000', label: '黑色' },
];

const TodoPage = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  // 分类相关状态
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [filterCategoryId, setFilterCategoryId] = useState(null);
  const [categoryDrawerVisible, setCategoryDrawerVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm] = Form.useForm();

  // 加载 TODO 列表
  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await getTodos();
      setTodos(res.data?.list || []);
    } catch (error) {
      if (error.response?.status !== 401) {
        message.error('加载待办事项失败');
      }
    } finally {
      setLoading(false);
    }
  };

  // 加载分类列表
  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (error) {
      if (error.response?.status !== 401) {
        message.error('加载分类失败');
      }
    }
  };

  useEffect(() => {
    loadTodos();
    loadCategories();
  }, []);

  // Tab + 分类双重过滤
  const filteredTodos = useMemo(() => {
    let list = todos;
    if (filterCategoryId !== null) {
      list = list.filter((t) => t.category_id === filterCategoryId);
    }
    switch (activeTab) {
      case 'todo':
        return list.filter((t) => t.status !== 1);
      case 'done':
        return list.filter((t) => t.status === 1);
      case 'overdue':
        return list.filter(
          (t) => t.due_date && t.status !== 1 && dayjs(t.due_date).isBefore(dayjs())
        );
      default:
        return list;
    }
  }, [todos, activeTab, filterCategoryId]);

  // Tab 数量统计（基于分类过滤后的结果）
  const tabCounts = useMemo(() => {
    const base =
      filterCategoryId !== null
        ? todos.filter((t) => t.category_id === filterCategoryId)
        : todos;
    return {
      all: base.length,
      todo: base.filter((t) => t.status !== 1).length,
      done: base.filter((t) => t.status === 1).length,
      overdue: base.filter(
        (t) => t.due_date && t.status !== 1 && dayjs(t.due_date).isBefore(dayjs())
      ).length,
    };
  }, [todos, filterCategoryId]);

  // 打开 Todo 创建/编辑弹窗
  const openModal = (todo = null) => {
    setEditingTodo(todo);
    if (todo) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        completed: todo.status === 1,
        due_date: todo.due_date ? dayjs(todo.due_date) : null,
        category_id: todo.category_id || undefined,
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTodo(null);
    form.resetFields();
  };

  // 提交 Todo 表单
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingTodo) {
        const { completed, due_date, ...rest } = values;
        const payload = {
          ...rest,
          status: completed ? 1 : 0,
          due_date: due_date ? due_date.toISOString() : null,
        };
        await updateTodo(editingTodo.id, payload);
        message.success('更新成功');
      } else {
        const { completed, due_date, ...createData } = values;
        const payload = {
          ...createData,
          due_date: due_date ? due_date.toISOString() : null,
        };
        await createTodo(payload);
        message.success('创建成功');
      }
      closeModal();
      loadTodos();
    } catch (error) {
      // 拦截器已处理
    } finally {
      setLoading(false);
    }
  };

  // 删除 Todo
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteTodo(id);
      message.success('删除成功');
      loadTodos();
    } catch (error) {
      // 拦截器已处理
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
      // 拦截器已处理
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
      logoutUser();
      navigate('/login');
    }
  };

  // ========== 分类管理 ==========

  // 打开分类创建/编辑弹窗
  const openCategoryModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      categoryForm.setFieldsValue({
        name: category.name,
        color: category.color,
      });
    } else {
      categoryForm.resetFields();
      categoryForm.setFieldsValue({ color: '#1677ff' });
    }
    setCategoryModalVisible(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalVisible(false);
    setEditingCategory(null);
    categoryForm.resetFields();
  };

  // 提交分类表单
  const handleCategorySubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        message.success('分类更新成功');
      } else {
        await createCategory(values);
        message.success('分类创建成功');
      }
      closeCategoryModal();
      loadCategories();
    } catch (error) {
      // 拦截器已处理
    }
  };

  // 删除分类
  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      message.success('分类删除成功');
      if (filterCategoryId === id) {
        setFilterCategoryId(null);
      }
      loadCategories();
    } catch (error) {
      // 拦截器已处理
    }
  };

  // ========== Tab 配置 ==========
  const tabItems = [
    {
      key: 'all',
      label: (
        <span>
          全部{' '}
          <Badge count={tabCounts.all} showZero color="#8c8c8c" size="small" />
        </span>
      ),
    },
    {
      key: 'todo',
      label: (
        <span>
          未完成{' '}
          <Badge count={tabCounts.todo} showZero color="#1677ff" size="small" />
        </span>
      ),
    },
    {
      key: 'done',
      label: (
        <span>
          已完成{' '}
          <Badge count={tabCounts.done} showZero color="#52c41a" size="small" />
        </span>
      ),
    },
    {
      key: 'overdue',
      label: (
        <span>
          已逾期{' '}
          <Badge count={tabCounts.overdue} showZero color="#f5222d" size="small" />
        </span>
      ),
    },
  ];

  // ========== 渲染 List Item 的操作按钮 ==========
  const renderItemActions = (todo) => {
    if (isMobile) {
      const menuItems = [
        {
          key: 'edit',
          label: '编辑',
          icon: <EditOutlined />,
          onClick: () => openModal(todo),
        },
        {
          key: 'delete',
          label: '删除',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => {
            Modal.confirm({
              title: '确定删除这个待办事项？',
              okText: '确定',
              cancelText: '取消',
              okButtonProps: { danger: true },
              onOk: () => handleDelete(todo.id),
            });
          },
        },
      ];
      return [
        <Dropdown key="more" menu={{ items: menuItems }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>,
      ];
    }

    return [
      <Button
        key="edit"
        type="text"
        icon={<EditOutlined />}
        onClick={() => openModal(todo)}
      >
        编辑
      </Button>,
      <Popconfirm
        key="delete"
        title="确定删除这个待办事项？"
        onConfirm={() => handleDelete(todo.id)}
        okText="确定"
        cancelText="取消"
      >
        <Button type="text" danger icon={<DeleteOutlined />}>
          删除
        </Button>
      </Popconfirm>,
    ];
  };

  return (
    <Layout className="min-h-screen">
      <Header
        className="bg-white shadow-sm flex items-center justify-between"
        style={{ paddingLeft: isMobile ? 12 : 24, paddingRight: isMobile ? 12 : 24 }}
      >
        <div
          className="font-bold text-gray-800"
          style={{ fontSize: isMobile ? 16 : 20 }}
        >
          {isMobile ? 'TODO' : 'TODO 管理系统'}
        </div>
        <Space size={isMobile ? 4 : 8}>
          {!isMobile && <span className="text-gray-600">欢迎, {user?.username}</span>}
          <Tooltip title="压测">
            <Button
              icon={<ThunderboltOutlined />}
              onClick={() => navigate('/stress-test')}
              size={isMobile ? 'small' : 'middle'}
            >
              {!isMobile && '压测'}
            </Button>
          </Tooltip>
          <Tooltip title="分类管理">
            <Button
              icon={<AppstoreOutlined />}
              onClick={() => setCategoryDrawerVisible(true)}
              size={isMobile ? 'small' : 'middle'}
            >
              {!isMobile && '分类'}
            </Button>
          </Tooltip>
          <Tooltip title="设置">
            <Button
              icon={<SettingOutlined />}
              onClick={() => navigate('/settings')}
              size={isMobile ? 'small' : 'middle'}
            >
              {!isMobile && '设置'}
            </Button>
          </Tooltip>
          <Tooltip title="退出登录">
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              danger
              size={isMobile ? 'small' : 'middle'}
            >
              {!isMobile && '退出'}
            </Button>
          </Tooltip>
        </Space>
      </Header>

      <Content style={{ padding: isMobile ? '12px 8px' : '24px' }}>
        <Card
          title="我的待办事项"
          styles={{ body: { padding: isMobile ? '0 8px 12px' : '24px' } }}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              size={isMobile ? 'small' : 'middle'}
            >
              {!isMobile && '新建'}
            </Button>
          }
        >
          {/* Tab 过滤 */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size={isMobile ? 'small' : 'middle'}
            style={{ marginBottom: 0 }}
          />

          {/* 分类横向滚动筛选条 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              gap: 8,
              padding: '8px 0',
              marginBottom: 8,
              scrollbarWidth: 'none',
            }}
          >
            <Tag.CheckableTag
              checked={filterCategoryId === null}
              onChange={() => setFilterCategoryId(null)}
              style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              全部分类
            </Tag.CheckableTag>
            {categories.map((cat) => (
              <Tag.CheckableTag
                key={cat.id}
                checked={filterCategoryId === cat.id}
                onChange={() =>
                  setFilterCategoryId(filterCategoryId === cat.id ? null : cat.id)
                }
                style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: cat.color,
                    marginRight: 4,
                  }}
                />
                {cat.name}
              </Tag.CheckableTag>
            ))}
          </div>

          {/* Todo 列表 */}
          <List
            loading={loading}
            dataSource={filteredTodos}
            locale={{
              emptyText: (
                <Empty description="暂无待办事项">
                  <Button type="primary" onClick={() => openModal()}>
                    创建第一个待办
                  </Button>
                </Empty>
              ),
            }}
            renderItem={(todo) => {
              const isOverdue =
                todo.due_date &&
                todo.status !== 1 &&
                dayjs(todo.due_date).isBefore(dayjs());

              return (
                <List.Item actions={renderItemActions(todo)}>
                  <List.Item.Meta
                    avatar={
                      <Checkbox
                        checked={todo.status === 1}
                        onChange={() => toggleCompleted(todo)}
                      />
                    }
                    title={
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            textDecoration: todo.status === 1 ? 'line-through' : 'none',
                            color: todo.status === 1 ? '#bfbfbf' : '#262626',
                          }}
                        >
                          {todo.title}
                        </span>
                        {todo.status === 1 && <Tag color="success">已完成</Tag>}
                        {todo.category && (
                          <Tag color={todo.category.color} style={{ fontSize: 11 }}>
                            {todo.category.name}
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        {todo.description && (
                          <span
                            style={{
                              textDecoration: todo.status === 1 ? 'line-through' : 'none',
                              color: todo.status === 1 ? '#d9d9d9' : '#595959',
                            }}
                          >
                            {todo.description}
                          </span>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 12,
                            marginTop: 4,
                            fontSize: 12,
                            color: '#8c8c8c',
                          }}
                        >
                          <span>
                            <ClockCircleOutlined style={{ marginRight: 3 }} />
                            {dayjs(todo.created_at).format('YYYY-MM-DD HH:mm')}
                          </span>
                          {todo.due_date && (
                            <span style={{ color: isOverdue ? '#f5222d' : '#fa8c16' }}>
                              <CalendarOutlined style={{ marginRight: 3 }} />
                              截止：{dayjs(todo.due_date).format('YYYY-MM-DD HH:mm')}
                            </span>
                          )}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>

        {/* Todo 创建/编辑弹窗 */}
        <Modal
          title={editingTodo ? '编辑待办' : '新建待办'}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          width={isMobile ? '100%' : 520}
          style={{ top: isMobile ? 0 : 100 }}
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
            <Form.Item name="description" label="描述">
              <TextArea placeholder="请输入待办描述（可选）" rows={3} />
            </Form.Item>
            <Form.Item name="due_date" label="截止时间">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择截止时间（可选）"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="category_id" label="分类">
              <Select
                allowClear
                placeholder="选择分类（可选）"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      style={{ width: '100%', textAlign: 'left' }}
                      onClick={() => {
                        setModalVisible(false);
                        openCategoryModal();
                      }}
                    >
                      新建分类
                    </Button>
                  </>
                )}
              >
                {categories.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: c.color,
                        marginRight: 6,
                      }}
                    />
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="completed" valuePropName="checked">
              <Checkbox>已完成</Checkbox>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={closeModal}>取消</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingTodo ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 分类创建/编辑弹窗 */}
        <Modal
          title={editingCategory ? '编辑分类' : '新建分类'}
          open={categoryModalVisible}
          onCancel={closeCategoryModal}
          footer={null}
          width={isMobile ? '100%' : 400}
          style={{ top: isMobile ? 0 : 100 }}
        >
          <Form
            form={categoryForm}
            onFinish={handleCategorySubmit}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="名称"
              rules={[
                { required: true, message: '请输入分类名称' },
                { max: 50, message: '名称最多50个字符' },
              ]}
            >
              <Input placeholder="请输入分类名称" />
            </Form.Item>
            <Form.Item name="color" label="颜色">
              <Select
                options={COLOR_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: (
                    <span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: opt.value,
                          marginRight: 6,
                        }}
                      />
                      {opt.label}
                    </span>
                  ),
                }))}
                placeholder="选择颜色"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={closeCategoryModal}>取消</Button>
                <Button type="primary" htmlType="submit">
                  {editingCategory ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 分类管理 Drawer */}
        <Drawer
          title="分类管理"
          placement="right"
          width={isMobile ? '100%' : 400}
          open={categoryDrawerVisible}
          onClose={() => setCategoryDrawerVisible(false)}
          footer={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openCategoryModal()}
              block
            >
              新建分类
            </Button>
          }
        >
          <List
            dataSource={categories}
            renderItem={(cat) => (
              <List.Item
                actions={[
                  <Tooltip key="edit" title={cat.is_preset ? '系统预置不可编辑' : '编辑'}>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      disabled={cat.is_preset}
                      onClick={() => openCategoryModal(cat)}
                    />
                  </Tooltip>,
                  <Popconfirm
                    key="delete"
                    title="确定删除此分类？"
                    onConfirm={() => handleDeleteCategory(cat.id)}
                    okText="确定"
                    cancelText="取消"
                    disabled={cat.is_preset}
                  >
                    <Tooltip title={cat.is_preset ? '系统预置不可删除' : '删除'}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={cat.is_preset}
                      />
                    </Tooltip>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <span
                      style={{
                        display: 'inline-block',
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: cat.color,
                        marginTop: 4,
                      }}
                    />
                  }
                  title={
                    <Space>
                      <span>{cat.name}</span>
                      {cat.is_preset && (
                        <Tag color="default" style={{ fontSize: 11 }}>
                          系统预置
                        </Tag>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Drawer>
      </Content>
    </Layout>
  );
};

export default TodoPage;

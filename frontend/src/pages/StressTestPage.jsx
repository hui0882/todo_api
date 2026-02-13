import React, { useState } from 'react';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Select,
  Space,
  Statistic,
  Row,
  Col,
  Alert,
  Progress,
  Divider,
  Table,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  ThunderboltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const { Header, Content } = Layout;
const { TextArea } = Input;

const StressTestPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  // 预定义的测试场景
  const testScenarios = [
    {
      label: '登录接口',
      method: 'POST',
      url: '/api/v1/user/login',
      body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
    },
    {
      label: '获取TODO列表',
      method: 'GET',
      url: '/api/v1/todos',
      body: '',
    },
    {
      label: '创建TODO',
      method: 'POST',
      url: '/api/v1/todos',
      body: JSON.stringify({ title: 'Test Todo', description: 'Test Description' }),
    },
  ];

  // 执行单次请求
  const executeRequest = async (config) => {
    const startTime = performance.now();
    try {
      const response = await axios({
        method: config.method,
        url: config.url,
        data: config.body ? JSON.parse(config.body) : undefined,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 30000,
      });
      const endTime = performance.now();
      return {
        success: true,
        status: response.status,
        duration: endTime - startTime,
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        success: false,
        status: error.response?.status || 0,
        duration: endTime - startTime,
        error: error.message,
      };
    }
  };

  // 执行压测
  const handleStressTest = async (values) => {
    setLoading(true);
    setTesting(true);
    setResults(null);
    setProgress(0);
    setChartData([]);

    const { baseURL, method, endpoint, body, totalRequests, concurrency } = values;
    const url = baseURL + endpoint;

    const requestConfig = {
      method,
      url,
      body,
    };

    const allResults = [];
    const totalBatches = Math.ceil(totalRequests / concurrency);
    const tempChartData = [];

    try {
      for (let batch = 0; batch < totalBatches; batch++) {
        const batchSize = Math.min(concurrency, totalRequests - batch * concurrency);
        const batchPromises = [];

        for (let i = 0; i < batchSize; i++) {
          batchPromises.push(executeRequest(requestConfig));
        }

        const batchResults = await Promise.all(batchPromises);
        allResults.push(...batchResults);

        // 计算当前统计
        const completedRequests = allResults.length;
        const successCount = allResults.filter(r => r.success).length;
        const avgDuration = allResults.reduce((sum, r) => sum + r.duration, 0) / completedRequests;

        // 更新图表数据
        tempChartData.push({
          requests: completedRequests,
          avgResponseTime: Math.round(avgDuration),
          successRate: Math.round((successCount / completedRequests) * 100),
        });
        setChartData([...tempChartData]);

        // 更新进度
        const currentProgress = Math.round((completedRequests / totalRequests) * 100);
        setProgress(currentProgress);

        // 小延迟避免过度压测
        if (batch < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // 计算最终结果
      const successCount = allResults.filter(r => r.success).length;
      const failCount = allResults.length - successCount;
      const durations = allResults.map(r => r.duration);
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);
      const successRate = (successCount / allResults.length) * 100;

      // 计算百分位数
      const sortedDurations = [...durations].sort((a, b) => a - b);
      const p50 = sortedDurations[Math.floor(sortedDurations.length * 0.5)];
      const p90 = sortedDurations[Math.floor(sortedDurations.length * 0.9)];
      const p95 = sortedDurations[Math.floor(sortedDurations.length * 0.95)];
      const p99 = sortedDurations[Math.floor(sortedDurations.length * 0.99)];

      // 统计状态码分布
      const statusCodes = {};
      allResults.forEach(r => {
        statusCodes[r.status] = (statusCodes[r.status] || 0) + 1;
      });

      setResults({
        totalRequests: allResults.length,
        successCount,
        failCount,
        successRate: successRate.toFixed(2),
        avgDuration: avgDuration.toFixed(2),
        minDuration: minDuration.toFixed(2),
        maxDuration: maxDuration.toFixed(2),
        p50: p50.toFixed(2),
        p90: p90.toFixed(2),
        p95: p95.toFixed(2),
        p99: p99.toFixed(2),
        statusCodes,
      });

      message.success('压测完成');
    } catch (error) {
      message.error('压测过程中出现错误');
    } finally {
      setLoading(false);
      setTesting(false);
      setProgress(100);
    }
  };

  // 停止压测
  const handleStop = () => {
    setTesting(false);
    message.info('正在停止压测...');
  };

  // 加载预设场景
  const loadScenario = (scenario) => {
    const config = form.getFieldsValue();
    form.setFieldsValue({
      ...config,
      method: scenario.method,
      endpoint: scenario.url,
      body: scenario.body,
    });
  };

  const statusColumns = [
    {
      title: '状态码',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '次数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => `${text}%`,
    },
  ];

  const statusData = results?.statusCodes
    ? Object.entries(results.statusCodes).map(([status, count]) => ({
        key: status,
        status,
        count,
        percentage: ((count / results.totalRequests) * 100).toFixed(2),
      }))
    : [];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm flex items-center px-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
        >
          返回
        </Button>
        <div className="text-xl font-bold text-gray-800 ml-4">接口压测</div>
      </Header>

      <Content className="p-6">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[16, 16]}>
            <Col span={24} lg={10}>
              <Card title="压测配置">
                <Alert
                  message="注意"
                  description="压测会对服务器产生较大负载，请在测试环境中使用，避免影响生产环境。"
                  type="warning"
                  showIcon
                  className="mb-4"
                />

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleStressTest}
                  initialValues={{
                    baseURL: 'http://localhost:8080',
                    method: 'GET',
                    endpoint: '/health',
                    totalRequests: 100,
                    concurrency: 10,
                  }}
                >
                  <Form.Item
                    name="baseURL"
                    label="服务器地址"
                    rules={[{ required: true, message: '请输入服务器地址' }]}
                  >
                    <Input placeholder="http://localhost:8080" />
                  </Form.Item>

                  <Form.Item
                    name="method"
                    label="请求方法"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Select.Option value="GET">GET</Select.Option>
                      <Select.Option value="POST">POST</Select.Option>
                      <Select.Option value="PUT">PUT</Select.Option>
                      <Select.Option value="DELETE">DELETE</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="endpoint"
                    label="接口路径"
                    rules={[{ required: true, message: '请输入接口路径' }]}
                  >
                    <Input placeholder="/api/v1/todos" />
                  </Form.Item>

                  <Form.Item name="body" label="请求体 (JSON)">
                    <TextArea
                      rows={4}
                      placeholder='{"key": "value"}'
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="totalRequests"
                        label="总请求数"
                        rules={[{ required: true }]}
                      >
                        <Input type="number" min={1} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="concurrency"
                        label="并发数"
                        rules={[{ required: true }]}
                      >
                        <Input type="number" min={1} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider>快速场景</Divider>
                  <Space wrap className="mb-4">
                    {testScenarios.map((scenario, index) => (
                      <Button
                        key={index}
                        size="small"
                        onClick={() => loadScenario(scenario)}
                      >
                        {scenario.label}
                      </Button>
                    ))}
                  </Space>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<ThunderboltOutlined />}
                        loading={loading}
                        disabled={testing}
                      >
                        开始压测
                      </Button>
                      {testing && (
                        <Button
                          danger
                          icon={<StopOutlined />}
                          onClick={handleStop}
                        >
                          停止
                        </Button>
                      )}
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col span={24} lg={14}>
              {testing && (
                <Card title="压测进度" className="mb-4">
                  <Progress percent={progress} status="active" />
                </Card>
              )}

              {results && (
                <>
                  <Card title="压测结果" className="mb-4">
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Statistic
                          title="总请求数"
                          value={results.totalRequests}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="成功率"
                          value={results.successRate}
                          suffix="%"
                          valueStyle={{
                            color: results.successRate >= 90 ? '#3f8600' : '#cf1322',
                          }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="平均响应时间"
                          value={results.avgDuration}
                          suffix="ms"
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="成功次数"
                          value={results.successCount}
                          valueStyle={{ color: '#3f8600' }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="失败次数"
                          value={results.failCount}
                          valueStyle={{ color: '#cf1322' }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="最小响应时间"
                          value={results.minDuration}
                          suffix="ms"
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="最大响应时间"
                          value={results.maxDuration}
                          suffix="ms"
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic title="P50" value={results.p50} suffix="ms" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="P90" value={results.p90} suffix="ms" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="P95" value={results.p95} suffix="ms" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="P99" value={results.p99} suffix="ms" />
                      </Col>
                    </Row>
                  </Card>

                  <Card title="状态码分布" className="mb-4">
                    <Table
                      columns={statusColumns}
                      dataSource={statusData}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </>
              )}

              {chartData.length > 0 && (
                <Card title="实时监控">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="requests" label={{ value: '请求数', position: 'insideBottom', offset: -5 }} />
                      <YAxis
                        yAxisId="left"
                        label={{ value: '响应时间 (ms)', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: '成功率 (%)', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgResponseTime"
                        stroke="#8884d8"
                        name="平均响应时间"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="successRate"
                        stroke="#82ca9d"
                        name="成功率"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default StressTestPage;

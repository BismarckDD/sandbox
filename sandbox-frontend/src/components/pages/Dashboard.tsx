import { Card, Col, Row, Statistic, Table, Tag, Space, Button } from 'antd'
import {
  BugOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { fakeTasks } from '../../mock/data'

interface DashboardProps {
  currentUserRole: 'scientist' | 'admin'
}

const Dashboard = ({ currentUserRole }: DashboardProps) => {
  const taskStats = [
    {
      title: '调试中',
      value: fakeTasks.filter((t) => t.status === 'DEBUGGING').length,
      icon: <BugOutlined style={{ color: '#1890ff' }} />,
      color: '#e6f7ff',
    },
    {
      title: '训练中',
      value: fakeTasks.filter((t) => t.status === 'TRAINING').length,
      icon: <RocketOutlined style={{ color: '#722ed1' }} />,
      color: '#f9f0ff',
    },
    {
      title: '已完成',
      value: fakeTasks.filter((t) => t.status === 'COMPLETED').length,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      color: '#f6ffed',
    },
    {
      title: '被拦截',
      value: fakeTasks.filter((t) => t.status === 'FAILED').length,
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      color: '#fff2f0',
    },
  ]

  const statusColors: Record<string, string> = {
    CREATED: 'default',
    DEBUGGING: 'processing',
    TRAINING: 'warning',
    AUDITING: 'purple',
    COMPLETED: 'success',
    FAILED: 'error',
  }

  const statusLabels: Record<string, string> = {
    CREATED: '已创建',
    DEBUGGING: '调试中',
    TRAINING: '训练中',
    AUDITING: '审核中',
    COMPLETED: '已完成',
    FAILED: '已失败',
  }

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: '数据集',
      dataIndex: 'dataset',
      key: 'dataset',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small">
            查看详情
          </Button>
          <Button type="link" size="small">
            进入工作台
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>工作台主页</h2>
        <p style={{ color: '#666' }}>
          欢迎回来，{currentUserRole === 'admin' ? '数据合规官' : '科学家'}
        </p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {taskStats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: '#333' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        title="最近任务"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            新建任务
          </Button>
        }
      >
        <Table columns={columns} dataSource={fakeTasks} pagination={false} rowKey="key" />
      </Card>
    </div>
  )
}

export default Dashboard
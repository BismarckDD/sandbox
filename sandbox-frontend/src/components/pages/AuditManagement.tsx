import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Descriptions,
  Timeline,
  Alert,
  Typography,
  Divider,
  Tooltip,
  Tabs,
  message,
} from 'antd'
import {
  AuditOutlined,
  DownloadOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { fakeAuditTasks } from '../../mock/data'

const { Title, Text } = Typography

interface AuditManagementProps {
  currentUserRole: 'scientist' | 'admin'
}

const AuditManagement = ({ currentUserRole }: AuditManagementProps) => {
  const [selectedTask, setSelectedTask] = useState<unknown>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const auditReport = {
    timeline: [
      { time: '2026-06-11 10:45', event: '提交审计' },
      { time: '2026-06-11 10:46', event: '启动合规检查' },
      { time: '2026-06-11 10:47', event: '数据合规性检查通过' },
      { time: '2026-06-11 10:48', event: '模型安全性检查通过' },
    ],
  }

  const adminColumns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          PENDING: 'orange',
          PASSED: 'green',
          REJECTED: 'red',
        }
        const labelMap: Record<string, string> = {
          PENDING: '审核中',
          PASSED: '审核通过',
          REJECTED: '审核不通过',
        }
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>
      },
    },
    {
      title: '模型文件',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '风险评分',
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score: number) => (
        <span style={{ color: score > 50 ? '#ff4d4f' : '#52c41a' }}>
          {score}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: (typeof fakeAuditTasks)[number]) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            审核
          </Button>
        </Space>
      ),
    },
  ]

  const userColumns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          PENDING: 'orange',
          PASSED: 'green',
          REJECTED: 'red',
        }
        const labelMap: Record<string, string> = {
          PENDING: '审核中',
          PASSED: '审核通过',
          REJECTED: '审核不通过',
        }
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>
      },
    },
    {
      title: '模型文件',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: (typeof fakeAuditTasks)[number]) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看详情
          </Button>
          {record.status === 'PASSED' && (
            <Button type="link" icon={<DownloadOutlined />}>
              下载模型
            </Button>
          )}
          {record.status === 'REJECTED' && (
            <Tooltip title={record.rejectReason}>
              <Button type="link" danger icon={<WarningOutlined />}>
                查看原因
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  const handleViewDetail = (record: unknown) => {
    setSelectedTask(record)
    setIsDetailModalOpen(true)
  }

  const handleApprove = () => {
    message.success('审计通过，模型权重已解锁')
    setIsDetailModalOpen(false)
  }

  const handleReject = () => {
    message.error('审计拒绝，模型权重已锁定')
    setIsDetailModalOpen(false)
  }

  const detailContent = selectedTask && typeof selectedTask === 'object' ? (selectedTask as Record<string, unknown>) : null

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>审计与出域管理</h2>
        <p style={{ color: '#666' }}>
          {currentUserRole === 'admin' ? '审核训练完成的模型，确保合规性' : '查看模型审计状态和下载结果'}
        </p>
      </div>

      {currentUserRole === 'admin' ? (
        <Card
          title={
            <Space>
              <AuditOutlined />
              <span>审计列表（管理员）</span>
            </Space>
          }
        >
          <Table columns={adminColumns} dataSource={fakeAuditTasks} pagination={false} rowKey="key" />
        </Card>
      ) : (
        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: 'all',
              label: '全部',
              children: (
                <Card>
                  <Table columns={userColumns} dataSource={fakeAuditTasks} pagination={false} rowKey="key" />
                </Card>
              ),
            },
            {
              key: 'pending',
              label: '审核中',
              children: (
                <Card>
                  <Table
                    columns={userColumns}
                    dataSource={fakeAuditTasks.filter((t) => t.status === 'PENDING')}
                    pagination={false}
                    rowKey="key"
                  />
                </Card>
              ),
            },
            {
              key: 'passed',
              label: '审核通过',
              children: (
                <Card>
                  <Table
                    columns={userColumns}
                    dataSource={fakeAuditTasks.filter((t) => t.status === 'PASSED')}
                    pagination={false}
                    rowKey="key"
                  />
                </Card>
              ),
            },
            {
              key: 'rejected',
              label: '审核不通过',
              children: (
                <Card>
                  <Table
                    columns={userColumns}
                    dataSource={fakeAuditTasks.filter((t) => t.status === 'REJECTED')}
                    pagination={false}
                    rowKey="key"
                  />
                </Card>
              ),
            },
          ]}
        />
      )}

      <Modal
        title="审计详情"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={800}
        footer={
          currentUserRole === 'admin' && detailContent?.status === 'PENDING'
            ? [
                <Button key="reject" danger onClick={handleReject} icon={<CloseCircleOutlined />}>
                  拒绝
                </Button>,
                <Button key="approve" type="primary" onClick={handleApprove} icon={<CheckCircleOutlined />}>
                  通过
                </Button>,
              ]
            : detailContent?.status === 'PASSED'
            ? [
                <Button key="download" type="primary" icon={<DownloadOutlined />}>
                  下载模型权重
                </Button>,
              ]
            : null
        }
      >
        {detailContent && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="任务名称" span={2}>
                {detailContent.name as string}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag
                  color={
                    detailContent.status === 'PASSED'
                      ? 'green'
                      : detailContent.status === 'REJECTED'
                      ? 'red'
                      : 'orange'
                  }
                >
                  {detailContent.status === 'PASSED'
                    ? '审核通过'
                    : detailContent.status === 'REJECTED'
                    ? '审核不通过'
                    : '审核中'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="风险评分">
                <span
                  style={{
                    color:
                      (detailContent.riskScore as number) > 50 ? '#ff4d4f' : '#52c41a',
                  }}
                >
                  {detailContent.riskScore as number}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="数据集">
                {detailContent.dataset as string}
              </Descriptions.Item>
              <Descriptions.Item label="训练时间">
                {detailContent.trainingTime as string}
              </Descriptions.Item>
              <Descriptions.Item label="模型文件" span={2}>
                {detailContent.model as string}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>合规报告</Title>
            <Timeline
              items={auditReport.timeline.map((item) => ({
                children: (
                  <div>
                    <Text type="secondary">{item.time}</Text>
                    <br />
                    <Text>{item.event}</Text>
                  </div>
                ),
              }))}
            />

            <Divider />

            <Alert
              message="审计说明"
              description={
                detailContent.status === 'PENDING'
                  ? '审计代理正在进行合规性检查，请稍候...'
                  : detailContent.status === 'PASSED'
                  ? '审计通过，模型权重已解锁，可以下载。'
                  : `审计拒绝：${detailContent.rejectReason as string}`
              }
              type={
                detailContent.status === 'PENDING'
                  ? 'info'
                  : detailContent.status === 'PASSED'
                  ? 'success'
                  : 'error'
              }
              showIcon
            />

            {detailContent.status === 'REJECTED' && (
              <Card
                title="违规日志片段"
                size="small"
                style={{ marginTop: 16 }}
              >
                <div
                  style={{
                    background: '#fff2f0',
                    padding: 12,
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    fontSize: 12,
                  }}
                >
                  <div style={{ color: '#ff4d4f' }}>
                    [WARN] 检测到潜在敏感信息泄露
                  </div>
                  <div>时间: 2026-06-09 17:30:25</div>
                  <div>位置: /secure_zone/official_data/sample_001.jpg</div>
                  <div>
                    描述: 模型输出中包含可识别的个人身份信息
                  </div>
                  <div>风险等级: 高</div>
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AuditManagement
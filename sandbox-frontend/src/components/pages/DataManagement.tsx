import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip,
  Tabs,
} from 'antd'
import {
  DatabaseOutlined,
  EyeOutlined,
  DownloadOutlined,
  PlusOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import { fakeDatasets, adminImports } from '../../mock/data'

const { RangePicker } = DatePicker

interface DataManagementProps {
  currentUserRole: 'scientist' | 'admin'
}

const DataManagement = ({ currentUserRole }: DataManagementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState<unknown>(null)
  const [modalType, setModalType] = useState<'import' | 'apply'>('apply')
  const [form] = Form.useForm()

  const userColumns = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '简介',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '样本数',
      dataIndex: 'samples',
      key: 'samples',
      render: (samples: number) => samples.toLocaleString(),
    },
    {
      title: '可用时间段',
      dataIndex: 'availablePeriod',
      key: 'availablePeriod',
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'available' ? 'green' : 'orange'}>
          {status === 'available' ? '可用' : '处理中'}
        </Tag>
      ),
    },
    {
      title: '申请状态',
      dataIndex: 'hasApplied',
      key: 'hasApplied',
      render: (hasApplied: boolean) =>
        hasApplied ? <Tag color="blue">已申请</Tag> : <Tag>未申请</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: (typeof fakeDatasets)[number]) => (
        <Space size="middle">
          <Tooltip title="预览样例数据">
            <Button type="link" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="下载样例数据">
            <Button type="link" icon={<DownloadOutlined />} />
          </Tooltip>
          {record.canApply && !record.hasApplied && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleApply(record)}
            >
              申请使用
            </Button>
          )}
          {record.canApply && record.hasApplied && (
            <Tag color="green">已获授权</Tag>
          )}
        </Space>
      ),
    },
  ]

  const adminColumns = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '导入者',
      dataIndex: 'importedBy',
      key: 'importedBy',
    },
    {
      title: '导入时间',
      dataIndex: 'importedAt',
      key: 'importedAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'processing'}>
          {status === 'completed' ? '已完成' : '处理中'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Tooltip title="预览样例数据">
            <Button type="link" icon={<EyeOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleApply = (record: unknown) => {
    setSelectedDataset(record)
    setModalType('apply')
    setIsModalOpen(true)
  }

  const handleImport = () => {
    setModalType('import')
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedDataset(null)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(modalType === 'import' ? '导入数据:' : '申请数据:', values)
      message.success(modalType === 'import' ? '数据导入申请已提交' : '申请已提交，等待管理员审批')
      handleCancel()
    })
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>数据私域管理</h2>
        <p style={{ color: '#666' }}>
          {currentUserRole === 'admin' ? '管理数据集导入和审批' : '浏览可用数据集，申请使用权限'}
        </p>
      </div>

      {currentUserRole === 'admin' ? (
        <Tabs
          defaultActiveKey="imports"
          items={[
            {
              key: 'imports',
              label: (
                <span>
                  <ImportOutlined />
                  导入记录
                </span>
              ),
              children: (
                <Card
                  title={
                    <Space>
                      <DatabaseOutlined />
                      <span>数据导入列表</span>
                    </Space>
                  }
                  extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleImport}>
                      数据导入
                    </Button>
                  }
                >
                  <Table columns={adminColumns} dataSource={adminImports} pagination={false} rowKey="key" />
                </Card>
              ),
            },
            {
              key: 'datasets',
              label: (
                <span>
                  <DatabaseOutlined />
                  数据集列表
                </span>
              ),
              children: (
                <Card>
                  <Table columns={userColumns} dataSource={fakeDatasets} pagination={false} rowKey="key" />
                </Card>
              ),
            },
          ]}
        />
      ) : (
        <Card
          title={
            <Space>
              <DatabaseOutlined />
              <span>数据集列表</span>
            </Space>
          }
        >
          <Table columns={userColumns} dataSource={fakeDatasets} pagination={false} rowKey="key" />
        </Card>
      )}

      <Modal
        title={
          modalType === 'import'
            ? '数据导入申请'
            : `申请使用数据集: ${selectedDataset && typeof selectedDataset === 'object' && 'name' in selectedDataset ? (selectedDataset as { name: string }).name : ''}`
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={modalType === 'import' ? '提交导入' : '提交申请'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="purpose"
            label="申请理由"
            rules={[{ required: true, message: '请输入申请理由' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细说明使用该数据集的目的" />
          </Form.Item>
          {modalType === 'apply' && (
            <Form.Item
              name="authPeriod"
              label="授权时间"
              rules={[{ required: true, message: '请选择授权时间段' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item
            name="algorithm"
            label="预期训练算法"
            rules={[{ required: true, message: '请选择预期训练算法' }]}
          >
            <Select placeholder="选择算法类型">
              <Select.Option value="classification">图像分类</Select.Option>
              <Select.Option value="detection">目标检测</Select.Option>
              <Select.Option value="segmentation">图像分割</Select.Option>
              <Select.Option value="reid">行人重识别</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="补充说明">
            <Input.TextArea rows={3} placeholder="其他需要说明的信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DataManagement
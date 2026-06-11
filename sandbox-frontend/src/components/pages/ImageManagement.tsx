import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Tooltip, Input } from 'antd'
import { CloudServerOutlined, UploadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { fakeImages } from '../../mock/data'

interface ImageManagementProps {
  currentUserRole: 'scientist' | 'admin'
}

const ImageManagement = ({ currentUserRole }: ImageManagementProps) => {
  const [searchText, setSearchText] = useState('')

  const filteredImages = fakeImages.filter((img) => {
    if (currentUserRole === 'scientist') {
      return (
        (img.type === 'public' || img.uploader === 'scientist1') &&
        img.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    return img.name.toLowerCase().includes(searchText.toLowerCase())
  })

  const columns = [
    {
      title: '镜像名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'public' ? 'blue' : 'orange'}>
          {type === 'public' ? '公有镜像' : '私有镜像'}
        </Tag>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '上传者',
      dataIndex: 'uploader',
      key: 'uploader',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          ready: 'green',
          building: 'processing',
          failed: 'error',
        }
        const labelMap: Record<string, string> = {
          ready: '就绪',
          building: '构建中',
          failed: '失败',
        }
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Tooltip title="功能暂不开发">
            <Button type="link" icon={<DeleteOutlined />} disabled>
              删除
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>镜像管理</h2>
        <p style={{ color: '#666' }}>
          {currentUserRole === 'admin'
            ? '管理所有公有和私有镜像'
            : '查看公有镜像和管理您的私有镜像'}
        </p>
      </div>

      <Card
        title={
          <Space>
            <CloudServerOutlined />
            <span>镜像列表</span>
          </Space>
        }
        extra={
          <Tooltip title="功能暂不开发">
            <Button type="primary" icon={<UploadOutlined />} disabled>
              上传镜像
            </Button>
          </Tooltip>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索镜像名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </Space>
        <Table
          columns={columns}
          dataSource={filteredImages}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}

export default ImageManagement
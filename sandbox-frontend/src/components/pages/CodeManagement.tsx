import { useState } from 'react'
import { Card, Table, Button, Space, Tooltip, Input } from 'antd'
import { CodeOutlined, UploadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { fakeCodes } from '../../mock/data'

const CodeManagement = () => {
  const [searchText, setSearchText] = useState('')

  const filteredCodes = fakeCodes.filter((code) =>
    code.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: '代码名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
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
      title: '上传时间',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
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
        <h2 style={{ marginBottom: 8 }}>代码管理</h2>
        <p style={{ color: '#666' }}>管理训练代码和推理脚本</p>
      </div>

      <Card
        title={
          <Space>
            <CodeOutlined />
            <span>代码列表</span>
          </Space>
        }
        extra={
          <Tooltip title="功能暂不开发">
            <Button type="primary" icon={<UploadOutlined />} disabled>
              上传代码
            </Button>
          </Tooltip>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索代码名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </Space>
        <Table
          columns={columns}
          dataSource={filteredCodes}
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

export default CodeManagement
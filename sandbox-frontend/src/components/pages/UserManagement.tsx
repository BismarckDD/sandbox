import { Card, Table, Tag, Space, Switch, Typography, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { allUsers } from '../../mock/data'

const { Text } = Typography

const UserManagement = () => {
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '显示名',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '数据合规官' : '科学家'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '活跃' : '未活跃'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: (typeof allUsers)[number]) => (
        <Space size="middle">
          <Switch
            checkedChildren="管理员"
            unCheckedChildren="科学家"
            checked={record.role === 'admin'}
            onChange={(checked) => {
              message.info(
                `已将 ${record.displayName} 角色切换为 ${checked ? '管理员' : '科学家'}`
              )
            }}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>用户管理</h2>
        <p style={{ color: '#666' }}>管理系统用户和角色权限</p>
      </div>

      <Card
        title={
          <Space>
            <UserOutlined />
            <span>用户列表</span>
          </Space>
        }
      >
        <Table columns={columns} dataSource={allUsers} pagination={false} rowKey="id" />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Text type="secondary">
          提示：科学家可以申请数据使用权和上传镜像/代码；管理员可以导入数据、审核模型和查看监控告警。
        </Text>
      </Card>
    </div>
  )
}

export default UserManagement
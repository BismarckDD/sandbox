import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { fakeUsers } from '../../mock/data'

const { Title, Text } = Typography

interface LoginProps {
  onLogin: (user: { id: string; username: string; role: 'scientist' | 'admin'; displayName: string }) => void
}

const Login = ({ onLogin }: LoginProps) => {
  const [loading, setLoading] = useState(false)

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true)
    setTimeout(() => {
      const user = fakeUsers.find(
        (u) => u.username === values.username && u.password === values.password
      )
      if (user) {
        message.success(`欢迎回来，${user.displayName}`)
        onLogin({ id: user.id, username: user.username, role: user.role, displayName: user.displayName })
      } else {
        message.error('用户名或密码错误')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="large">
          <div>
            <SafetyOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Title level={3} style={{ marginTop: 8, marginBottom: 0 }}>
              数据沙盒系统
            </Title>
            <Text type="secondary">双循环数据私域分享平台</Text>
          </div>

          <Form name="login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
            </Form.Item>
          </Form>

          <div style={{ fontSize: 12, color: '#999' }}>
            <div>普通用户: user / user1!</div>
            <div>管理员: admin / admin1!</div>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default Login
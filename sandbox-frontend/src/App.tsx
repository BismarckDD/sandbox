import { useState } from 'react'
import { Layout, Menu, theme, Button, Space, Avatar, Dropdown, Badge, Tag } from 'antd'
import './App.css'
import {
  DashboardOutlined,
  DatabaseOutlined,
  CodeOutlined,
  AuditOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloudServerOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

import Login from './components/pages/Login'
import Dashboard from './components/pages/Dashboard'
import UserManagement from './components/pages/UserManagement'
import DataManagement from './components/pages/DataManagement'
import ImageManagement from './components/pages/ImageManagement'
import CodeManagement from './components/pages/CodeManagement'
import SandboxWorkspace from './components/pages/SandboxWorkspace'
import AuditManagement from './components/pages/AuditManagement'
import MonitoringAlerts from './components/pages/MonitoringAlerts'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

interface UserInfo {
  id: string
  username: string
  role: 'scientist' | 'admin'
  displayName: string
}

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState('dashboard')
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const allMenuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '工作台主页',
    },
    {
      key: 'data-management',
      icon: <DatabaseOutlined />,
      label: '数据管理',
    },
    {
      key: 'image-management',
      icon: <CloudServerOutlined />,
      label: '镜像管理',
    },
    {
      key: 'code-management',
      icon: <CodeOutlined />,
      label: '代码管理',
    },
    {
      key: 'sandbox-workspace',
      icon: <CodeOutlined />,
      label: '任务开发工作台',
    },
    {
      key: 'audit',
      icon: <AuditOutlined />,
      label: '审计管理',
    },
    {
      key: 'user-management',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: 'monitoring',
      icon: <LineChartOutlined />,
      label: '监控告警',
    },
  ]

  const menuItems = allMenuItems.filter((item) => {
    if (!currentUser) return false
    if (currentUser.role === 'admin') return true
    return item?.key !== 'user-management' && item?.key !== 'monitoring'
  })

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        setCurrentUser(null)
        setSelectedKey('dashboard')
      },
    },
  ]

  const handleLogin = (user: UserInfo) => {
    setCurrentUser(user)
    setSelectedKey('dashboard')
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: collapsed ? '14px' : '16px' }}>
            {collapsed ? 'DS' : '数据沙盒'}
          </h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Space size="middle">
            <Tag color={currentUser.role === 'admin' ? 'red' : 'blue'}>
              {currentUser.role === 'admin' ? '管理员' : '科学家'}
            </Tag>
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{currentUser.displayName}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          {selectedKey === 'dashboard' && <Dashboard currentUserRole={currentUser.role} />}
          {selectedKey === 'user-management' && currentUser.role === 'admin' && <UserManagement />}
          {selectedKey === 'data-management' && <DataManagement currentUserRole={currentUser.role} />}
          {selectedKey === 'image-management' && <ImageManagement currentUserRole={currentUser.role} />}
          {selectedKey === 'code-management' && <CodeManagement />}
          {selectedKey === 'sandbox-workspace' && <SandboxWorkspace />}
          {selectedKey === 'audit' && <AuditManagement currentUserRole={currentUser.role} />}
          {selectedKey === 'monitoring' && currentUser.role === 'admin' && <MonitoringAlerts />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
# 双循环数据沙盒系统 - 前端 DEMO

数据私域分享沙盒应用，展示"数据所有权与使用权分离"的**双循环（内循环调试 ⇄ 外循环训练）**工作流。

## 技术栈

- React 19 + TypeScript 6
- Ant Design 6
- ECharts 6（训练曲线可视化）
- Tailwind CSS 4
- Vite 8

## 项目结构

```
sandbox/
├── AGENTS.md              # 为OpenCode准备的配置文件
├── README.md              # 项目说明
└── sandbox-frontend/      # 前端应用
    ├── src/
    │   ├── components/pages/   # 页面组件
    │   │   ├── Login.tsx              # 登录页
    │   │   ├── Dashboard.tsx          # 工作台主页
    │   │   ├── DataManagement.tsx     # 数据管理
    │   │   ├── ImageManagement.tsx    # 镜像管理
    │   │   ├── CodeManagement.tsx     # 代码管理
    │   │   ├── SandboxWorkspace.tsx   # 任务开发工作台
    │   │   ├── AuditManagement.tsx    # 审计管理
    │   │   ├── MonitoringAlerts.tsx   # 监控告警
    │   │   └── UserManagement.tsx     # 用户管理
    │   ├── mock/data.ts       # Mock数据
    │   ├── App.tsx            # 主入口
    │   └── App.css            # Dark Mode样式
    ├── package.json
    └── vite.config.ts
```

## 快速开始

### 环境要求

- Node.js >= 18

### 安装运行

```bash
cd sandbox-frontend
npm install
npm run dev
```

访问 http://localhost:5173

## 登录账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 普通用户 | user | user1! |
| 管理员 | admin | admin1! |

## 功能模块

| 模块 | 说明 | 权限 |
|------|------|------|
| 工作台主页 | 任务统计概览 | 所有用户 |
| 数据管理 | 数据集浏览、申请使用 | 所有用户 |
| 镜像管理 | 公有/私有镜像列表 | 所有用户 |
| 代码管理 | 训练代码列表 | 所有用户 |
| 任务管理 | 双循环调试/训练工作台 | 所有用户 |
| 审计管理 | 模型审核与下载 | 所有用户 |
| 监控告警 | ECharts图表+告警日志 | 仅管理员 |
| 用户管理 | 角色权限管理 | 仅管理员 |

## 状态流转

```
CREATED → DEBUGGING → TRAINING → AUDITING → COMPLETED/FAILED
```

- **CREATED**: 已创建
- **DEBUGGING**: 调试中（可访问WebSSH终端）
- **TRAINING**: 运行中（全封闭，不可介入）
- **AUDITING**: 审核中（全封闭，不可介入）
- **COMPLETED**: 运行结束
- **FAILED**: 运行失败

## Mock 数据

Mock数据位于 `src/mock/data.ts`，包含：

- 用户数据（fakeUsers）
- 数据集（fakeDatasets）
- 镜像（fakeImages）
- 代码（fakeCodes）
- 任务（fakeTasks）
- 审计任务（fakeAuditTasks）
- 监控指标（fakeMetrics）
- 告警日志（fakeAlerts）
- 系统日志（fakeSystemLogs）
- 训练曲线（trainingCurveData）

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run lint     # ESLint检查
npm run preview  # 预览构建结果
```

import { useState } from 'react'
import {
  Card,
  Steps,
  Button,
  Space,
  Tree,
  Tag,
  Alert,
  Progress,
  Table,
  Modal,
  Form,
  Select,
  message,
} from 'antd'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  DatabaseOutlined,
  CodeOutlined,
  AuditOutlined,
  EnterOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { fakeTasks, fakeImages, fakeCodes, fakeDatasets, trainingCurveData } from '../../mock/data'
import type { Task } from '../../mock/data'

const SandboxWorkspace = () => {
  const [view, setView] = useState<'list' | 'workspace'>('list')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [taskStatus, setTaskStatus] = useState<string>('CREATED')
  const [isDebugging, setIsDebugging] = useState(false)
  const [debugProgress, setDebugProgress] = useState(0)
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedCode, setSelectedCode] = useState<string>('')
  const [selectedDataset, setSelectedDataset] = useState<string>('')
  const [form] = Form.useForm()

  const isLocked = taskStatus === 'TRAINING' || taskStatus === 'AUDITING'

  const readyImages = fakeImages.filter((img) => img.status === 'ready')
  const readyDatasets = fakeDatasets.filter((ds) => ds.hasApplied)

  const statusLabels: Record<string, string> = {
    CREATED: '已创建',
    DEBUGGING: '调试中',
    TRAINING: '运行中',
    AUDITING: '审核中',
    COMPLETED: '运行结束',
    FAILED: '运行失败',
  }

  const statusColors: Record<string, string> = {
    CREATED: 'default',
    DEBUGGING: 'processing',
    TRAINING: 'warning',
    AUDITING: 'purple',
    COMPLETED: 'success',
    FAILED: 'error',
  }

  const taskColumns = [
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
      render: (_: unknown, record: Task) => (
        <Button
          type="primary"
          icon={<EnterOutlined />}
          onClick={() => handleEnterWorkspace(record)}
        >
          进入工作台
        </Button>
      ),
    },
  ]

  const sampleDataTree = [
    {
      title: 'sample_data',
      key: '0',
      children: [
        {
          title: 'images',
          key: '0-0',
          children: [
            { title: 'image_001.jpg', key: '0-0-0', isLeaf: true },
            { title: 'image_002.jpg', key: '0-0-1', isLeaf: true },
            { title: 'image_003.jpg', key: '0-0-2', isLeaf: true },
          ],
        },
        {
          title: 'annotations',
          key: '0-1',
          children: [
            { title: 'labels.json', key: '0-1-0', isLeaf: true },
            { title: 'masks/', key: '0-1-1' },
          ],
        },
        { title: 'metadata.csv', key: '0-2', isLeaf: true },
      ],
    },
  ]

  const trainingLogs = [
    '2026-06-11 10:30:00 - Epoch 1/10 - loss: 2.3456 - accuracy: 0.45',
    '2026-06-11 10:30:05 - Epoch 1/10 - loss: 2.1234 - accuracy: 0.52',
    '2026-06-11 10:30:10 - Epoch 1/10 - loss: 1.9876 - accuracy: 0.58',
    '2026-06-11 10:30:15 - Epoch 2/10 - loss: 1.8765 - accuracy: 0.63',
    '2026-06-11 10:30:20 - Epoch 2/10 - loss: 1.7654 - accuracy: 0.67',
    '2026-06-11 10:30:25 - Epoch 3/10 - loss: 1.6543 - accuracy: 0.71',
    '2026-06-11 10:30:30 - Epoch 4/10 - loss: 1.5432 - accuracy: 0.75',
    '2026-06-11 10:30:35 - Epoch 5/10 - loss: 1.4321 - accuracy: 0.78',
    '2026-06-11 10:30:40 - Epoch 6/10 - loss: 1.3210 - accuracy: 0.81',
    '2026-06-11 10:30:45 - Epoch 7/10 - loss: 1.2100 - accuracy: 0.84',
  ]

  const lossChartOption = {
    tooltip: {
      trigger: 'axis' as const,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: trainingCurveData.epochs,
    },
    yAxis: {
      type: 'value' as const,
      name: 'Loss',
    },
    series: [
      {
        name: 'Loss',
        type: 'line' as const,
        smooth: true,
        data: trainingCurveData.loss,
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255,77,79,0.3)' },
              { offset: 1, color: 'rgba(255,77,79,0.05)' },
            ],
          },
        },
        lineStyle: { color: '#ff4d4f', width: 2 },
        itemStyle: { color: '#ff4d4f' },
      },
    ],
  }

  const accuracyChartOption = {
    tooltip: {
      trigger: 'axis' as const,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: trainingCurveData.epochs,
    },
    yAxis: {
      type: 'value' as const,
      name: 'Accuracy',
      min: 0,
      max: 1,
    },
    series: [
      {
        name: 'Accuracy',
        type: 'line' as const,
        smooth: true,
        data: trainingCurveData.accuracy,
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24,144,255,0.3)' },
              { offset: 1, color: 'rgba(24,144,255,0.05)' },
            ],
          },
        },
        lineStyle: { color: '#1890ff', width: 2 },
        itemStyle: { color: '#1890ff' },
      },
    ],
  }

  const handleEnterWorkspace = (task: Task) => {
    setSelectedTask(task)
    setTaskStatus(task.status)
    setView('workspace')
    if (task.status === 'DEBUGGING') {
      setIsDebugging(true)
      setDebugProgress(100)
    }
  }

  const handleBackToList = () => {
    setView('list')
    setSelectedTask(null)
    setCurrentStep(0)
    setIsDebugging(false)
    setDebugProgress(0)
    setTaskStatus('CREATED')
  }

  const handleStartDebug = () => {
    setIsResourceModalOpen(true)
  }

  const handleConfirmResource = () => {
    form.validateFields().then((values) => {
      setSelectedImage(values.image)
      setSelectedCode(values.code)
      setSelectedDataset(values.dataset)
      setIsResourceModalOpen(false)

      setIsDebugging(true)
      setTaskStatus('DEBUGGING')
      message.info('正在启动调试环境...')

      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setDebugProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          message.success('调试环境已就绪')
        }
      }, 500)
    })
  }

  const handleStopDebug = () => {
    setIsDebugging(false)
    setTaskStatus('CREATED')
    setDebugProgress(0)
    setSelectedImage('')
    setSelectedCode('')
    setSelectedDataset('')
    message.info('调试环境已关闭')
  }

  const handleStartTraining = () => {
    setTaskStatus('TRAINING')
    setCurrentStep(1)
    message.info('SSH隧道已安全熔断，正式训练已启动')
  }

  const stepsItems = [
    {
      title: '内循环调试',
      description: '调试环境和代码验证',
    },
    {
      title: '外循环训练',
      description: '正式训练和监控',
    },
  ]

  // 任务列表视图
  if (view === 'list') {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 8 }}>任务管理</h2>
          <p style={{ color: '#666' }}>展示属于当前用户的所有任务</p>
        </div>

        <Card
          title={
            <Space>
              <DatabaseOutlined />
              <span>任务列表</span>
            </Space>
          }
        >
          <Table
            columns={taskColumns}
            dataSource={fakeTasks}
            rowKey="key"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Card>
      </div>
    )
  }

  // 工作台视图
  const renderDebugStep = () => (
    <div className={isLocked ? '' : 'debug-dark-mode'}>
      <Card
        title={
          <Space>
            <span>内循环调试</span>
            {isDebugging ? (
              <Tag color="green">调试中</Tag>
            ) : (
              <Tag color="default">未启动</Tag>
            )}
          </Space>
        }
        extra={<Tag color="orange">Step 1</Tag>}
      >
        <Alert
          message="调试模式"
          description="在调试模式下，您可以访问样例数据并使用WebSSH终端进行代码调试。调试完成后，请点击确认调试完毕按钮进入正式训练。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStartDebug}
              disabled={isDebugging || isLocked}
            >
              启动调试
            </Button>
            <Button
              icon={<PauseCircleOutlined />}
              onClick={handleStopDebug}
              disabled={!isDebugging || isLocked}
            >
              关闭调试
            </Button>
          </Space>
          {isDebugging && (
            <Progress
              percent={debugProgress}
              status={debugProgress < 100 ? 'active' : 'success'}
              style={{ marginTop: 8 }}
            />
          )}
          {isDebugging && debugProgress >= 100 && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              镜像: {readyImages.find((i) => i.key === selectedImage)?.name || '-'} |
              代码: {fakeCodes.find((c) => c.key === selectedCode)?.name || '-'} |
              数据: {fakeDatasets.find((d) => d.key === selectedDataset)?.name || '-'}
            </div>
          )}
        </div>

        {isLocked ? (
          <Alert
            message="调试环境已锁定"
            description="当前处于训练/审计阶段，SSH隧道已安全熔断，调试功能不可用。"
            type="warning"
            showIcon
            icon={<LockOutlined />}
            style={{ marginBottom: 16 }}
          />
        ) : (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Card
              title={
                <Space>
                  <DatabaseOutlined />
                  <span>样例数据预览</span>
                </Space>
              }
              size="small"
              style={{ flex: 1, minWidth: 280 }}
              className="debug-dark-card"
            >
              <Tree
                treeData={sampleDataTree}
                defaultExpandAll
                showLine
                className="debug-dark-tree"
                onSelect={(keys) => console.log('选中文件:', keys)}
              />
            </Card>

            <Card
              title={
                <Space>
                  <CodeOutlined />
                  <span>WebSSH终端</span>
                </Space>
              }
              size="small"
              style={{ flex: 2, minWidth: 400 }}
              className="debug-dark-card"
            >
              {isDebugging ? (
                <div className="debug-terminal">
                  <div style={{ color: '#6a9955' }}>
                    $ ssh user@12.34.56.78 -p 2222
                  </div>
                  <div style={{ color: '#569cd6' }}>
                    Welcome to Ubuntu 22.04.3 LTS
                  </div>
                  <div style={{ color: '#d4d4d4' }}>
                    Last login: Wed Jun 11 10:30:00 2026
                  </div>
                  <div style={{ color: '#d4d4d4' }}>
                    user@debug-container:~$ ls -la
                  </div>
                  <div style={{ color: '#d4d4d4' }}>total 32</div>
                  <div style={{ color: '#d4d4d4' }}>
                    drwxr-xr-x 4 user user 4096 Jun 11 10:30 .
                  </div>
                  <div style={{ color: '#d4d4d4' }}>
                    drwxr-xr-x 1 root root 4096 Jun 11 10:30 ..
                  </div>
                  <div style={{ color: '#d4d4d4' }}>
                    -rw-r--r-- 1 user user  220 Jun 11 10:30 .bash_logout
                  </div>
                  <div style={{ color: '#d4d4d4' }}>
                    -rw-r--r-- 1 user user 3771 Jun 11 10:30 .bashrc
                  </div>
                  <div style={{ color: '#d4d4d4' }}>drwxr-xr-x 2 user user 4096 Jun 11 10:30 workspace</div>
                  <div style={{ color: '#d4d4d4' }}>
                    user@debug-container:~$ <span>{'>'}</span>
                  </div>
                </div>
              ) : (
                <div className="debug-terminal-empty">
                  <LockOutlined style={{ fontSize: 32, color: '#666' }} />
                  <span style={{ color: '#666' }}>请先启动调试环境</span>
                </div>
              )}
            </Card>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={handleStartTraining}
            disabled={!isDebugging || debugProgress < 100 || isLocked}
            block
          >
            确认调试完毕，发起正式训练
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderTrainingStep = () => (
    <Card
      title={
        <Space>
          <span>外循环训练</span>
          <Tag color="purple">训练中</Tag>
        </Space>
      }
      extra={<Tag color="green">Step 2</Tag>}
    >
      <Alert
        message="训练模式"
        description="SSH隧道已安全熔断，正式数据已就位。此阶段为全封闭、不可介入的安全训练环境。"
        type="warning"
        showIcon
        icon={<LockOutlined />}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Card title="训练状态" size="small" style={{ flex: 1, minWidth: 250 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>任务ID:</strong> {selectedTask?.id}
            </div>
            <div>
              <strong>状态:</strong> <Tag color="purple">TRAINING</Tag>
            </div>
            <div>
              <strong>网络隔离:</strong>{' '}
              <Tag color="green">
                <LockOutlined /> 已隔离
              </Tag>
            </div>
            <div>
              <strong>数据路径:</strong> /secure_zone/official_data/
            </div>
            <Progress percent={65} status="active" />
          </Space>
        </Card>

        <Card title="Loss曲线" size="small" style={{ flex: 2, minWidth: 300 }}>
          <ReactECharts option={lossChartOption} style={{ height: 250 }} />
        </Card>

        <Card title="Accuracy曲线" size="small" style={{ flex: 2, minWidth: 300 }}>
          <ReactECharts option={accuracyChartOption} style={{ height: 250 }} />
        </Card>

        <Card
          title="实时日志"
          size="small"
          style={{ flex: 1, minWidth: 300 }}
        >
          <div className="debug-terminal" style={{ height: 250 }}>
            {trainingLogs.map((log, index) => (
              <div key={index} style={{ marginBottom: 4 }}>
                {log}
              </div>
            ))}
            <div style={{ color: '#6a9955' }}>
              正在训练中...
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button
          type="primary"
          size="large"
          icon={<AuditOutlined />}
          onClick={() => {
            setTaskStatus('AUDITING')
            message.info('训练完成，已提交审计')
          }}
          block
        >
          训练完成，提交审计
        </Button>
      </div>
    </Card>
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList}>
            返回任务列表
          </Button>
        </Space>
        <h2 style={{ marginBottom: 8, marginTop: 16 }}>{selectedTask?.name}</h2>
        <p style={{ color: '#666' }}>
          任务ID: {selectedTask?.id} | 状态:{' '}
          <Tag color={statusColors[taskStatus]}>
            {statusLabels[taskStatus]}
          </Tag>
        </p>
      </div>

      <Steps current={currentStep} items={stepsItems} style={{ marginBottom: 24 }} />

      {currentStep === 0 && renderDebugStep()}
      {currentStep === 1 && renderTrainingStep()}

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Space>
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)} disabled={isLocked}>
              上一步
            </Button>
          )}
          {currentStep < 1 && (
            <Button
              type="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              下一步
            </Button>
          )}
        </Space>
      </div>

      {/* 资源选择弹窗 */}
      <Modal
        title="选择调试资源"
        open={isResourceModalOpen}
        onOk={handleConfirmResource}
        onCancel={() => setIsResourceModalOpen(false)}
        okText="确认启动"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="image"
            label="选择镜像"
            rules={[{ required: true, message: '请选择镜像' }]}
          >
            <Select placeholder="选择可用镜像">
              {readyImages.map((img) => (
                <Select.Option key={img.key} value={img.key}>
                  {img.name} ({img.size})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="code"
            label="选择代码"
            rules={[{ required: true, message: '请选择代码' }]}
          >
            <Select placeholder="选择训练代码">
              {fakeCodes.map((code) => (
                <Select.Option key={code.key} value={code.key}>
                  {code.name} ({code.language})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dataset"
            label="选择数据集"
            rules={[{ required: true, message: '请选择数据集' }]}
          >
            <Select placeholder="选择可用数据集">
              {readyDatasets.map((ds) => (
                <Select.Option key={ds.key} value={ds.key}>
                  {ds.name} ({ds.size})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SandboxWorkspace
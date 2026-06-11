// 用户数据
export interface User {
  id: string
  username: string
  password: string
  role: 'scientist' | 'admin'
  displayName: string
}

export const fakeUsers: User[] = [
  { id: 'u1', username: 'user', password: 'user1!', role: 'scientist', displayName: '张科学家' },
  { id: 'u2', username: 'admin', password: 'admin1!', role: 'admin', displayName: '李合规官' },
]

// 用户管理列表（用于UserManagement页面）
export const allUsers = [
  { id: 'u1', username: 'scientist1', displayName: '张科学家', role: 'scientist' as const, status: 'active', lastLogin: '2026-06-11 09:00' },
  { id: 'u2', username: 'scientist2', displayName: '王研究员', role: 'scientist' as const, status: 'active', lastLogin: '2026-06-10 14:30' },
  { id: 'u3', username: 'scientist3', displayName: '赵工程师', role: 'scientist' as const, status: 'inactive', lastLogin: '2026-06-05 11:20' },
  { id: 'u4', username: 'admin1', displayName: '李合规官', role: 'admin' as const, status: 'active', lastLogin: '2026-06-11 08:45' },
  { id: 'u5', username: 'admin2', displayName: '刘主管', role: 'admin' as const, status: 'active', lastLogin: '2026-06-09 16:00' },
]

// 数据集
export interface Dataset {
  key: string
  name: string
  description: string
  size: string
  samples: number
  hasApplied: boolean
  canApply: boolean
  status: string
  availablePeriod?: string
}

export const fakeDatasets: Dataset[] = [
  {
    key: '1',
    name: '北京延庆低空无人机图像集',
    description: '包含10万张低空无人机拍摄的城市图像，用于行人重识别任务',
    size: '15.2 GB',
    samples: 100000,
    hasApplied: true,
    canApply: true,
    status: 'available',
    availablePeriod: '2026-06-01 ~ 2026-12-31',
  },
  {
    key: '2',
    name: 'ImageNet-1K子集',
    description: 'ImageNet数据集的精选子集，包含1000个类别',
    size: '8.5 GB',
    samples: 50000,
    hasApplied: false,
    canApply: true,
    status: 'available',
    availablePeriod: '2026-06-15 ~ 2026-09-30',
  },
  {
    key: '3',
    name: 'COCO 2017',
    description: 'Common Objects in Context数据集，用于目标检测和图像分割',
    size: '19.3 GB',
    samples: 120000,
    hasApplied: false,
    canApply: false,
    status: 'pending',
  },
]

// 管理员数据导入记录
export const adminImports = [
  { key: '1', name: '北京延庆低空无人机图像集', importedBy: '李合规官', importedAt: '2026-05-15', status: 'completed' },
  { key: '2', name: 'ImageNet-1K子集', importedBy: '李合规官', importedAt: '2026-05-20', status: 'completed' },
  { key: '3', name: 'COCO 2017', importedBy: '刘主管', importedAt: '2026-06-01', status: 'processing' },
]

// 镜像数据
export interface ImageRecord {
  key: string
  name: string
  type: 'public' | 'private'
  size: string
  uploader: string
  status: 'ready' | 'building' | 'failed'
  createdAt: string
}

export const fakeImages: ImageRecord[] = [
  { key: 'img1', name: 'PyTorch 2.2-CUDA 12.1', type: 'public', size: '8.5GB', uploader: 'admin1', status: 'ready', createdAt: '2026-04-10' },
  { key: 'img2', name: 'TensorFlow 2.15-CUDA 12.1', type: 'public', size: '7.2GB', uploader: 'admin1', status: 'ready', createdAt: '2026-04-15' },
  { key: 'img3', name: 'JAX 0.4-CUDA 12.1', type: 'public', size: '6.8GB', uploader: 'admin2', status: 'ready', createdAt: '2026-05-01' },
  { key: 'img4', name: '自定义训练环境v1', type: 'private', size: '3.1GB', uploader: 'scientist1', status: 'ready', createdAt: '2026-06-01' },
  { key: 'img5', name: '实验性CUDA镜像', type: 'private', size: '5.8GB', uploader: 'scientist1', status: 'building', createdAt: '2026-06-10' },
  { key: 'img6', name: '轻量级推理镜像', type: 'private', size: '1.2GB', uploader: 'scientist2', status: 'ready', createdAt: '2026-06-05' },
]

// 代码数据
export interface CodeRecord {
  key: string
  name: string
  language: string
  size: string
  uploadedAt: string
  uploader: string
}

export const fakeCodes: CodeRecord[] = [
  { key: 'code1', name: 'reid-resnet50', language: 'Python', size: '12.5MB', uploadedAt: '2026-06-10', uploader: 'scientist1' },
  { key: 'code2', name: 'vit-classification', language: 'Python', size: '8.3MB', uploadedAt: '2026-06-09', uploader: 'scientist1' },
  { key: 'code3', name: 'yolov8-detection', language: 'Python', size: '15.7MB', uploadedAt: '2026-06-08', uploader: 'scientist2' },
  { key: 'code4', name: 'transformer-nlp', language: 'Python', size: '6.2MB', uploadedAt: '2026-06-07', uploader: 'scientist1' },
  { key: 'code5', name: 'gan-generation', language: 'Python', size: '9.8MB', uploadedAt: '2026-06-06', uploader: 'scientist3' },
]

// 任务数据
export interface Task {
  key: string
  id: string
  name: string
  status: 'CREATED' | 'DEBUGGING' | 'TRAINING' | 'AUDITING' | 'COMPLETED' | 'FAILED'
  dataset: string
  createdAt: string
}

export const fakeTasks: Task[] = [
  { key: '1', id: 'task-2026-001', name: '行人重识别ResNet50训练任务', status: 'TRAINING', dataset: '北京延庆低空无人机图像集', createdAt: '2026-06-10 14:30' },
  { key: '2', id: 'task-2026-002', name: '图像分类ViT-B/16微调', status: 'DEBUGGING', dataset: 'ImageNet-1K子集', createdAt: '2026-06-11 09:15' },
  { key: '3', id: 'task-2026-003', name: '目标检测YOLOv8训练', status: 'COMPLETED', dataset: 'COCO 2017', createdAt: '2026-06-09 16:45' },
  { key: '4', id: 'task-2026-004', name: '语义分割DeepLabV3+', status: 'AUDITING', dataset: 'Cityscapes', createdAt: '2026-06-08 11:00' },
  { key: '5', id: 'task-2026-005', name: '超分辨率ESRGAN', status: 'FAILED', dataset: 'DIV2K', createdAt: '2026-06-07 08:30' },
]

// 审计数据
export interface AuditTask {
  key: string
  name: string
  status: 'PENDING' | 'PASSED' | 'REJECTED'
  model: string
  riskScore: number
  createdAt: string
  dataset: string
  trainingTime: string
  rejectReason?: string
}

export const fakeAuditTasks: AuditTask[] = [
  {
    key: '1',
    name: '行人重识别ResNet50训练任务',
    status: 'PENDING',
    model: 'resnet50_reid_v1.pth',
    riskScore: 0,
    createdAt: '2026-06-11 10:45',
    dataset: '北京延庆低空无人机图像集',
    trainingTime: '2小时30分钟',
  },
  {
    key: '2',
    name: '图像分类ViT-B/16微调',
    status: 'PASSED',
    model: 'vit_b16_cls_v1.pth',
    riskScore: 0,
    createdAt: '2026-06-10 16:30',
    dataset: 'ImageNet-1K子集',
    trainingTime: '1小时45分钟',
  },
  {
    key: '3',
    name: '目标检测YOLOv8训练',
    status: 'REJECTED',
    model: 'yolov8_obj_v1.pth',
    riskScore: 85,
    createdAt: '2026-06-09 14:20',
    dataset: 'COCO 2017',
    trainingTime: '3小时15分钟',
    rejectReason: '检测到敏感信息泄露风险',
  },
  {
    key: '4',
    name: '语义分割DeepLabV3+',
    status: 'PENDING',
    model: 'deeplabv3_cityscapes.pth',
    riskScore: 0,
    createdAt: '2026-06-08 18:00',
    dataset: 'Cityscapes',
    trainingTime: '4小时10分钟',
  },
]

// 监控数据
export const generateTimeSeries = (baseValue: number, variance: number, count: number) => {
  const data = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:00`,
      value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance)),
    })
  }
  return data
}

export const fakeMetrics = {
  cpu: generateTimeSeries(65, 30, 24),
  memory: generateTimeSeries(72, 20, 24),
  gpu: generateTimeSeries(78, 25, 24),
}

export const fakeAlerts = [
  { key: 'a1', time: '2026-06-11 10:30', level: 'warning', source: 'gpu-monitor', message: 'GPU温度超过80°C，当前温度82°C' },
  { key: 'a2', time: '2026-06-11 09:15', level: 'critical', source: 'disk-monitor', message: '磁盘使用率达到92%，超过阈值90%' },
  { key: 'a3', time: '2026-06-11 08:00', level: 'info', source: 'scheduler', message: '任务 task-2026-001 训练进度达到65%' },
  { key: 'a4', time: '2026-06-10 22:30', level: 'warning', source: 'memory-monitor', message: '内存使用率达到85%，接近阈值' },
  { key: 'a5', time: '2026-06-10 18:00', level: 'info', source: 'scheduler', message: '任务 task-2026-003 训练完成' },
  { key: 'a6', time: '2026-06-10 15:45', level: 'critical', source: 'network-monitor', message: '检测到异常网络连接，已阻断' },
  { key: 'a7', time: '2026-06-10 12:00', level: 'info', source: 'audit-agent', message: '任务 task-2026-002 审计通过' },
  { key: 'a8', time: '2026-06-10 09:30', level: 'warning', source: 'gpu-monitor', message: 'GPU显存使用率达到90%' },
]

export const fakeSystemLogs = [
  { key: 'l1', time: '2026-06-11 10:30:15', module: 'scheduler', level: 'INFO', message: 'Task task-2026-001 epoch 6/10 completed, loss=1.6543' },
  { key: 'l2', time: '2026-06-11 10:25:00', module: 'container-pool', level: 'INFO', message: 'Container debug-2026-002 started, resource allocated: 4CPU/16GB/1GPU' },
  { key: 'l3', time: '2026-06-11 10:20:30', module: 'audit-agent', level: 'INFO', message: 'Audit task-2026-004 started, scanning model outputs...' },
  { key: 'l4', time: '2026-06-11 10:15:00', module: 'data-gateway', level: 'WARN', message: 'Dataset COCO-2017 access request pending approval' },
  { key: 'l5', time: '2026-06-11 10:10:00', module: 'ssh-proxy', level: 'INFO', message: 'SSH tunnel established for user scientist1, port 2222' },
  { key: 'l6', time: '2026-06-11 10:05:00', module: 'scheduler', level: 'INFO', message: 'Task task-2026-002 moved to DEBUGGING state' },
  { key: 'l7', time: '2026-06-11 10:00:00', module: 'image-registry', level: 'INFO', message: 'Image PyTorch-2.2-CUDA-12.1 pulled successfully' },
  { key: 'l8', time: '2026-06-11 09:55:00', module: 'security-scanner', level: 'WARN', message: 'Potential credential leak detected in code repo vit-classification' },
  { key: 'l9', time: '2026-06-11 09:50:00', module: 'scheduler', level: 'INFO', message: 'Task queue: 2 pending, 1 running, 15 completed' },
  { key: 'l10', time: '2026-06-11 09:45:00', module: 'monitor', level: 'INFO', message: 'System health check: all services operational' },
]

// 工作台Mock任务（用于SandboxWorkspace）
export const mockSandboxTask = {
  id: 'task-2026-001',
  name: '行人重识别ResNet50训练任务',
  status: 'CREATED' as const,
  dataset: {
    name: '北京延庆低空无人机图像集',
    has_applied: true,
  },
  debug_config: {
    ssh_endpoint: 'ssh user@12.34.56.78 -p 2222',
    sample_data_path: '/workspace/sample_data/',
  },
  training_config: {
    is_network_isolated: true,
    official_data_path: '/secure_zone/official_data/',
  },
  audit_report: {
    result: 'PENDING' as const,
    risk_score: 0,
    message: '',
  },
}

// 训练曲线Mock数据
export const trainingCurveData = {
  epochs: Array.from({ length: 10 }, (_, i) => `Epoch ${i + 1}`),
  loss: [2.3456, 2.1234, 1.9876, 1.8765, 1.7654, 1.6543, 1.5432, 1.4321, 1.3210, 1.2100],
  accuracy: [0.45, 0.52, 0.58, 0.63, 0.67, 0.71, 0.75, 0.78, 0.81, 0.84],
}

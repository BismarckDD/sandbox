import { useState } from 'react'
import { Card, Table, Tag, Tabs, Select, Space } from 'antd'
import { AlertOutlined, LineChartOutlined, FileTextOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { fakeMetrics, fakeAlerts, fakeSystemLogs } from '../../mock/data'

const MonitoringAlerts = () => {
  const [alertLevelFilter, setAlertLevelFilter] = useState<string>('all')

  const getChartOption = (title: string, data: { time: string; value: number }[], color: string) => ({
    tooltip: {
      trigger: 'axis' as const,
      formatter: (params: Array<{ name: string; value: number; seriesName: string }>) => {
        const item = params[0]
        return `${item.seriesName}<br/>${item.name}: ${item.value.toFixed(1)}%`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: data.map((d) => d.time),
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: title,
        type: 'line' as const,
        smooth: true,
        data: data.map((d) => d.value.toFixed(1)),
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color + '60' },
              { offset: 1, color: color + '10' },
            ],
          },
        },
        lineStyle: { color, width: 2 },
        itemStyle: { color },
      },
    ],
  })

  const alertColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          info: 'blue',
          warning: 'orange',
          critical: 'red',
        }
        const labelMap: Record<string, string> = {
          info: '信息',
          warning: '警告',
          critical: '严重',
        }
        return <Tag color={colorMap[level]}>{labelMap[level]}</Tag>
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '内容',
      dataIndex: 'message',
      key: 'message',
    },
  ]

  const logColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 140,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          INFO: 'blue',
          WARN: 'orange',
          ERROR: 'red',
        }
        return <Tag color={colorMap[level]}>{level}</Tag>
      },
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
    },
  ]

  const filteredAlerts =
    alertLevelFilter === 'all'
      ? fakeAlerts
      : fakeAlerts.filter((a) => a.level === alertLevelFilter)

  const tabItems = [
    {
      key: 'metrics',
      label: (
        <span>
          <LineChartOutlined />
          监控图表
        </span>
      ),
      children: (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Card title="CPU使用率" size="small" style={{ flex: 1, minWidth: 350 }}>
            <ReactECharts option={getChartOption('CPU', fakeMetrics.cpu, '#1890ff')} style={{ height: 250 }} />
          </Card>
          <Card title="内存使用率" size="small" style={{ flex: 1, minWidth: 350 }}>
            <ReactECharts option={getChartOption('内存', fakeMetrics.memory, '#52c41a')} style={{ height: 250 }} />
          </Card>
          <Card title="GPU使用率" size="small" style={{ flex: 1, minWidth: 350 }}>
            <ReactECharts option={getChartOption('GPU', fakeMetrics.gpu, '#722ed1')} style={{ height: 250 }} />
          </Card>
        </div>
      ),
    },
    {
      key: 'alerts',
      label: (
        <span>
          <AlertOutlined />
          告警日志
        </span>
      ),
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <span>筛选级别：</span>
            <Select
              value={alertLevelFilter}
              onChange={setAlertLevelFilter}
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部' },
                { value: 'info', label: '信息' },
                { value: 'warning', label: '警告' },
                { value: 'critical', label: '严重' },
              ]}
            />
          </Space>
          <Table
            columns={alertColumns}
            dataSource={filteredAlerts}
            rowKey="key"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </div>
      ),
    },
    {
      key: 'logs',
      label: (
        <span>
          <FileTextOutlined />
          运行日志
        </span>
      ),
      children: (
        <Table
          columns={logColumns}
          dataSource={fakeSystemLogs}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>监控告警</h2>
        <p style={{ color: '#666' }}>查看系统监控指标、告警日志和运行日志（DEMO使用Fake数据）</p>
      </div>

      <Card>
        <Tabs defaultActiveKey="metrics" items={tabItems} />
      </Card>
    </div>
  )
}

export default MonitoringAlerts
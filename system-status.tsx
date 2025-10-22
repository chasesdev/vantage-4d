"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, Cpu, HardDrive, Thermometer, Zap, Wifi, AlertTriangle, CheckCircle, Settings } from 'lucide-react'

interface SystemStatusProps {
  systemStatus: any
}

export function SystemStatus({ systemStatus }: SystemStatusProps) {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: { usage: 45, temperature: 65, cores: 16 },
    gpu: { usage: 78, temperature: 72, memory: 24576, memoryUsed: 8192 },
    memory: { total: 65536, used: 32768, available: 32768 },
    storage: { total: 8000, used: 3200, available: 4800 },
    network: { status: 'connected', speed: '10 Gbps', latency: 1 }
  })

  const [hardwareStatus, setHardwareStatus] = useState({
    motherboard: { status: 'normal', temperature: 42 },
    powerSupply: { status: 'normal', load: 65 },
    cooling: { status: 'normal', fanSpeed: 1200 },
    pcie: { status: 'normal', bandwidth: '128 GB/s' }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: { 
          ...prev.cpu, 
          usage: Math.min(100, Math.max(0, prev.cpu.usage + (Math.random() - 0.5) * 10)),
          temperature: Math.min(90, Math.max(30, prev.cpu.temperature + (Math.random() - 0.5) * 5))
        },
        gpu: { 
          ...prev.gpu, 
          usage: Math.min(100, Math.max(0, prev.gpu.usage + (Math.random() - 0.5) * 15)),
          temperature: Math.min(85, Math.max(40, prev.gpu.temperature + (Math.random() - 0.5) * 3)),
          memoryUsed: Math.min(prev.gpu.memory, Math.max(0, prev.gpu.memoryUsed + (Math.random() - 0.5) * 1000))
        },
        memory: {
          ...prev.memory,
          used: Math.min(prev.memory.total, Math.max(0, prev.memory.used + (Math.random() - 0.5) * 2000))
        },
        network: {
          ...prev.network,
          latency: Math.max(0, prev.network.latency + (Math.random() - 0.5) * 2)
        }
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'default'
      case 'warning': return 'secondary'
      case 'critical': return 'destructive'
      default: return 'secondary'
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-500'
    if (usage < 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <CardTitle>System Overview</CardTitle>
          </div>
          <CardDescription>
            Vantage4D System Performance and Hardware Status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="hardware">Hardware</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              {/* CPU and GPU Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      CPU Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Usage</span>
                        <span className={getUsageColor(systemMetrics.cpu.usage)}>
                          {systemMetrics.cpu.usage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={systemMetrics.cpu.usage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Temperature</span>
                        <p className={systemMetrics.cpu.temperature > 70 ? 'text-red-500' : 'text-green-500'}>
                          {systemMetrics.cpu.temperature.toFixed(1)}°C
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Cores</span>
                        <p>{systemMetrics.cpu.cores} threads</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Intel Xeon W-2295 @ 3.0GHz
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      GPU Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Usage</span>
                        <span className={getUsageColor(systemMetrics.gpu.usage)}>
                          {systemMetrics.gpu.usage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={systemMetrics.gpu.usage} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Memory</span>
                        <span className="text-sm">
                          {formatBytes(systemMetrics.gpu.memoryUsed * 1024 * 1024)} / {formatBytes(systemMetrics.gpu.memory * 1024 * 1024)}
                        </span>
                      </div>
                      <Progress 
                        value={(systemMetrics.gpu.memoryUsed / systemMetrics.gpu.memory) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Temperature</span>
                        <p className={systemMetrics.gpu.temperature > 75 ? 'text-red-500' : 'text-green-500'}>
                          {systemMetrics.gpu.temperature.toFixed(1)}°C
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Render Time</span>
                        <p>16ms</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      NVIDIA RTX 6000 Blackwell (24GB)
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Memory and Storage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Memory Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>System Memory</span>
                        <span className="text-sm">
                          {formatBytes(systemMetrics.memory.used * 1024 * 1024 * 1024)} / {formatBytes(systemMetrics.memory.total * 1024 * 1024 * 1024)}
                        </span>
                      </div>
                      <Progress 
                        value={(systemMetrics.memory.used / systemMetrics.memory.total) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Available</span>
                        <p>{formatBytes(systemMetrics.memory.available * 1024 * 1024 * 1024)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Usage</span>
                        <p>{((systemMetrics.memory.used / systemMetrics.memory.total) * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      DDR4 ECC RAM @ 3200MHz
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Storage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>NVMe Storage</span>
                        <span className="text-sm">
                          {systemMetrics.storage.used} GB / {systemMetrics.storage.total} GB
                        </span>
                      </div>
                      <Progress 
                        value={(systemMetrics.storage.used / systemMetrics.storage.total) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Available</span>
                        <p>{systemMetrics.storage.available} GB</p>
                      </div>
                      <div>
                        <span className="font-medium">Read Speed</span>
                        <p>7,000 MB/s</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Samsung 980 PRO NVMe SSD
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hardware" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Thermometer className="w-5 h-5" />
                      <Badge variant={getStatusColor(hardwareStatus.motherboard.status)}>
                        {hardwareStatus.motherboard.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">Motherboard</div>
                    <div className="text-xs text-muted-foreground">
                      {hardwareStatus.motherboard.temperature}°C
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5" />
                      <Badge variant={getStatusColor(hardwareStatus.powerSupply.status)}>
                        {hardwareStatus.powerSupply.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">Power Supply</div>
                    <div className="text-xs text-muted-foreground">
                      {hardwareStatus.powerSupply.load}% load
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="w-5 h-5" />
                      <Badge variant={getStatusColor(hardwareStatus.cooling.status)}>
                        {hardwareStatus.cooling.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">Cooling System</div>
                    <div className="text-xs text-muted-foreground">
                      {hardwareStatus.cooling.fanSpeed} RPM
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <HardDrive className="w-5 h-5" />
                      <Badge variant={getStatusColor(hardwareStatus.pcie.status)}>
                        {hardwareStatus.pcie.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">PCIe Interface</div>
                    <div className="text-xs text-muted-foreground">
                      {hardwareStatus.pcie.bandwidth}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4" />
                      <span className="font-medium">Status:</span>
                      <Badge variant={systemMetrics.network.status === 'connected' ? 'default' : 'destructive'}>
                        {systemMetrics.network.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Speed:</span>
                      <span>{systemMetrics.network.speed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Latency:</span>
                      <span>{systemMetrics.network.latency.toFixed(1)}ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Connected Devices</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">Canon R5C</div>
                          <div className="text-sm text-muted-foreground">8K Video Camera</div>
                        </div>
                        <Badge variant={systemStatus.r5c.connected ? "default" : "destructive"}>
                          {systemStatus.r5c.connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">Canon R5 Mk II</div>
                          <div className="text-sm text-muted-foreground">Macro Camera</div>
                        </div>
                        <Badge variant={systemStatus.r5m2.connected ? "default" : "destructive"}>
                          {systemStatus.r5m2.connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">DJI Ronin</div>
                          <div className="text-sm text-muted-foreground">Gimbal System</div>
                        </div>
                        <Badge variant={systemStatus.gimbal.connected ? "default" : "destructive"}>
                          {systemStatus.gimbal.connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">Yuan SC750N1</div>
                          <div className="text-sm text-muted-foreground">HDMI 2.1 Capture Card</div>
                        </div>
                        <Badge variant="default">Connected</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Device Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="font-medium mb-1">System Information</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>OS: Windows 11 Pro</div>
                          <div>Version: 23H2</div>
                          <div>Uptime: 2 days, 14 hours</div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <div className="font-medium mb-1">Software Versions</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Vantage4D: v1.0.0</div>
                          <div>Canon SDK: v3.15.1</div>
                          <div>DJI SDK: v4.16</div>
                          <div>Gaussian Splatting: v1.0.0</div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <div className="font-medium mb-1">Licenses</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Canon SDK: Active</div>
                          <div>DJI SDK: Active</div>
                          <div>DMX Control: Active</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">System Logs</CardTitle>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Clear Logs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {[
                      { time: '14:32:15', type: 'info', message: 'System initialized successfully' },
                      { time: '14:32:18', type: 'success', message: 'Canon R5C connected via HDMI 2.1' },
                      { time: '14:32:20', type: 'success', message: 'DJI Ronin gimbal connected' },
                      { time: '14:32:22', type: 'warning', message: 'Canon R5 Mk II not detected' },
                      { time: '14:32:25', type: 'info', message: 'DMX lighting system connected' },
                      { time: '14:32:30', type: 'success', message: '8K video stream active' },
                      { time: '14:32:45', type: 'info', message: 'Focus stacking sequence initiated' },
                      { time: '14:33:12', type: 'success', message: '3D reconstruction started' },
                    ].map((log, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground font-mono">
                          {log.time}
                        </div>
                        <div className="flex items-center gap-2">
                          {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                          {log.type === 'info' && <Activity className="w-4 h-4 text-blue-500" />}
                          <span className="text-sm">{log.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
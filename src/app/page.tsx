"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, Video, Settings, Activity, Zap, Monitor, Play, Square, RotateCcw } from 'lucide-react'
import { CameraControlPanel } from '@/components/camera-control-panel'
import { GimbalControl } from '@/components/gimbal-control'
import { VideoPreview } from '@/components/video-preview'
import { Reconstruction3D } from '@/components/reconstruction-3d'
import { LightingControl } from '@/components/lighting-control'
import { SystemStatus } from '@/components/system-status'
import { ToFMonitoring } from '@/components/tof-monitoring'
import { CalibrationWorkflow } from '@/components/calibration-workflow'

export default function Vantage4DDashboard() {
  const [systemStatus, setSystemStatus] = useState({
    r5c: { connected: false, recording: false, mode: 'standby' },
    r5m2: { connected: false, capturing: false, focusStack: 0 },
    gimbal: { connected: false, mode: 'idle', battery: 100 },
    capture: { active: false, progress: 0, frames: 0 },
    reconstruction: { status: 'idle', progress: 0 }
  })

  const [alerts, setAlerts] = useState([
    { type: 'warning', message: 'Canon R5C not connected' },
    { type: 'info', message: 'System ready for calibration' }
  ])

  useEffect(() => {
    // Simulate system status updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        r5c: { ...prev.r5c, connected: Math.random() > 0.3 },
        r5m2: { ...prev.r5m2, connected: Math.random() > 0.2 },
        gimbal: { ...prev.gimbal, connected: Math.random() > 0.1, battery: Math.max(20, prev.gimbal.battery - Math.random() * 2) }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleStartCapture = async () => {
    setSystemStatus(prev => ({
      ...prev,
      capture: { active: true, progress: 0, frames: 0 }
    }))

    // Simulate capture progress
    const progressInterval = setInterval(() => {
      setSystemStatus(prev => {
        const newProgress = Math.min(100, prev.capture.progress + Math.random() * 10)
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          return { ...prev, capture: { active: false, progress: 100, frames: Math.floor(Math.random() * 500) + 200 } }
        }
        return { ...prev, capture: { ...prev.capture, progress: newProgress, frames: Math.floor(newProgress * 5) } }
      })
    }, 500)
  }

  const handleStopCapture = () => {
    setSystemStatus(prev => ({
      ...prev,
      capture: { active: false, progress: prev.capture.progress }
    }))
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <img
                src="https://z-cdn-media.chatglm.cn/files/d793a483-7f14-4656-a624-63af0cc3cd65_IMG_8782.jpeg?auth_key=1792661651-db992d55b33341ea8d166da1bfafa7c1-0-5a40983d8e8f0921e8815f3bdd665d85"
                alt="Vantage Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Vantage4D Control System</h1>
              <p className="text-muted-foreground">Integrated 8K Video & Macro Photography 3D Reconstruction</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={systemStatus.capture.active ? "destructive" : "secondary"} className="px-3 py-1">
              {systemStatus.capture.active ? "RECORDING" : "READY"}
            </Badge>
            <Button
              onClick={systemStatus.capture.active ? handleStopCapture : handleStartCapture}
              variant={systemStatus.capture.active ? "destructive" : "default"}
              size="lg"
              className="flex items-center gap-2"
            >
              {systemStatus.capture.active ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Capture
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Capture
                </>
              )}
            </Button>
          </div>
        </div>

        {/* System Status Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="font-medium">R5C (8K)</span>
                </div>
                <Badge variant={systemStatus.r5c.connected ? "default" : "destructive"}>
                  {systemStatus.r5c.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span className="font-medium">R5 Mk II</span>
                </div>
                <Badge variant={systemStatus.r5m2.connected ? "default" : "destructive"}>
                  {systemStatus.r5m2.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-medium">Gimbal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={systemStatus.gimbal.connected ? "default" : "destructive"}>
                    {systemStatus.gimbal.connected ? "Connected" : "Disconnected"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{Math.round(systemStatus.gimbal.battery)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Capture</span>
                </div>
                <span className="text-sm font-medium">{systemStatus.capture.frames} frames</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant={alert.type === 'warning' ? "destructive" : "default"}>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Capture Progress */}
        {systemStatus.capture.active && (
          <Card>
            <CardHeader>
              <CardTitle>Capture Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing frames...</span>
                  <span>{Math.round(systemStatus.capture.progress)}%</span>
                </div>
                <Progress value={systemStatus.capture.progress} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {systemStatus.capture.frames} frames captured
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Control Tabs */}
        <Tabs defaultValue="cameras" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="cameras">Cameras</TabsTrigger>
            <TabsTrigger value="gimbal">Gimbal</TabsTrigger>
            <TabsTrigger value="video">Video Preview</TabsTrigger>
            <TabsTrigger value="reconstruction">3D Reconstruction</TabsTrigger>
            <TabsTrigger value="lighting">Lighting</TabsTrigger>
            <TabsTrigger value="tof">ToF Monitoring</TabsTrigger>
            <TabsTrigger value="calibration">Calibration</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="cameras">
            <CameraControlPanel systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
          </TabsContent>

          <TabsContent value="gimbal">
            <GimbalControl systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
          </TabsContent>

          <TabsContent value="video">
            <VideoPreview systemStatus={systemStatus} />
          </TabsContent>

          <TabsContent value="reconstruction">
            <Reconstruction3D systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
          </TabsContent>

          <TabsContent value="lighting">
            <LightingControl />
          </TabsContent>

          <TabsContent value="tof">
            <ToFMonitoring />
          </TabsContent>

          <TabsContent value="calibration">
            <CalibrationWorkflow />
          </TabsContent>

          <TabsContent value="system">
            <SystemStatus systemStatus={systemStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
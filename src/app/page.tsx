'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, Video, Settings, Activity, Zap, Monitor, Play, Square, RotateCcw, Move3D } from 'lucide-react'

import { CameraControlPanel } from '@/components/camera-control-panel'
import { GimbalControl } from '@/components/gimbal-control'
import { VideoPreview } from '@/components/video-preview'
import { Reconstruction3D } from '@/components/reconstruction-3d'
import { LightingControl } from '@/components/lighting-control'
import { SystemStatus } from '@/components/system-status'
import { ToFMonitoring } from '@/components/tof-monitoring'
import { CalibrationWorkflow } from '@/components/calibration-workflow'
import { TurntableControl } from '@/components/turntable-control'

export default function Home() {
  const [systemStatus, setSystemStatus] = useState({
    r5c: { connected: false, recording: false, mode: 'standby' },
    r5m2: { connected: false, capturing: false, focusStack: 0 },
    gimbal: { connected: false, mode: 'idle', battery: 100 },
    turntable: { connected: false, moving: false, angle: 0 },
    capture: { active: false, progress: 0, frames: 0 },
    reconstruction: { status: 'idle', progress: 0 }
  })

  const [activeTab, setActiveTab] = useState('cameras')

  useEffect(() => {
    // Simulate system updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        gimbal: {
          ...prev.gimbal,
          battery: Math.max(0, prev.gimbal.battery - 0.1)
        }
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'start_capture':
        setSystemStatus(prev => ({
          ...prev,
          capture: { ...prev.capture, active: true }
        }))
        break
      case 'stop_capture':
        setSystemStatus(prev => ({
          ...prev,
          capture: { ...prev.capture, active: false, progress: 0 }
        }))
        break
      case 'emergency_stop':
        setSystemStatus(prev => ({
          ...prev,
          r5c: { ...prev.r5c, recording: false },
          r5m2: { ...prev.r5m2, capturing: false },
          capture: { active: false, progress: 0, frames: 0 }
        }))
        break
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Vantage4D Control System</h1>
              <p className="text-muted-foreground">Professional 4D Capture & Control Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={systemStatus.capture.active ? "default" : "secondary"} className="text-sm px-3 py-1">
                {systemStatus.capture.active ? "CAPTURING" : "STANDBY"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('system')}
              >
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">R5C Status</p>
                  <p className="text-2xl font-bold">{systemStatus.r5c.mode}</p>
                </div>
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">R5 Mark II</p>
                  <p className="text-2xl font-bold">{systemStatus.r5m2.focusStack} stack</p>
                </div>
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gimbal</p>
                  <p className="text-2xl font-bold">{Math.round(systemStatus.gimbal.battery)}%</p>
                </div>
                <RotateCcw className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Turntable</p>
                  <p className="text-2xl font-bold">{systemStatus.turntable?.angle || 0}°</p>
                </div>
                <Move3D className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Frames</p>
                  <p className="text-2xl font-bold">{systemStatus.capture.frames}</p>
                </div>
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        {systemStatus.gimbal.battery < 20 && (
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              Gimbal battery low ({Math.round(systemStatus.gimbal.battery)}%). Consider charging soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common capture workflow controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => handleQuickAction('start_capture')}
                disabled={systemStatus.capture.active}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Capture Sequence
              </Button>
              <Button 
                onClick={() => handleQuickAction('stop_capture')}
                disabled={!systemStatus.capture.active}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop Capture
              </Button>
              <Button 
                onClick={() => handleQuickAction('emergency_stop')}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Emergency Stop
              </Button>
            </div>
            
            {systemStatus.capture.active && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Capture Progress</span>
                  <span>{Math.round(systemStatus.capture.progress)}%</span>
                </div>
                <Progress value={systemStatus.capture.progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
            <CardDescription>Real-time connection and status monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span className="font-medium">R5C</span>
                </div>
                <Badge variant={systemStatus.r5c.connected ? "default" : "destructive"}>
                  {systemStatus.r5c.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span className="font-medium">R5 Mark II</span>
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
                  <Move3D className="w-4 h-4" />
                  <span className="font-medium">Turntable</span>
                </div>
                <Badge variant={systemStatus.turntable?.connected ? "default" : "destructive"}>
                  {systemStatus.turntable?.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <span className="font-medium">System</span>
                </div>
                <Badge variant="default">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Control Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="cameras">Cameras</TabsTrigger>
            <TabsTrigger value="gimbal">Gimbal</TabsTrigger>
            <TabsTrigger value="turntable">Turntable</TabsTrigger>
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

          <TabsContent value="turntable">
            <TurntableControl systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
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
            <CalibrationWorkflow systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
          </TabsContent>

          <TabsContent value="system">
            <SystemStatus systemStatus={systemStatus} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Vantage4D Control System v1.0.0</p>
            <p>Professional 4D Capture Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

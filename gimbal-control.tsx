"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RotateCcw, Move, Zap, Target, Play, Pause, RotateCw } from 'lucide-react'

interface GimbalControlProps {
  systemStatus: any
  setSystemStatus: any
}

export function GimbalControl({ systemStatus, setSystemStatus }: GimbalControlProps) {
  const [gimbalSettings, setGimbalSettings] = useState({
    mode: 'follow',
    pan: 0,
    tilt: 0,
    roll: 0,
    speed: 5,
    smoothness: 8,
    autoCalibration: false
  })

  const [trajectory, setTrajectory] = useState({
    type: 'circular',
    radius: 0.5,
    height: 0.3,
    duration: 10,
    points: []
  })

  const handleConnectGimbal = async () => {
    setSystemStatus(prev => ({
      ...prev,
      gimbal: { ...prev.gimbal, connected: !prev.gimbal.connected }
    }))
  }

  const handleMoveGimbal = async (axis: string, value: number) => {
    setGimbalSettings(prev => ({ ...prev, [axis]: value }))
    // Simulate gimbal movement
    console.log(`Moving ${axis} to ${value} degrees`)
  }

  const handleStartTrajectory = () => {
    setSystemStatus(prev => ({
      ...prev,
      gimbal: { ...prev.gimbal, mode: 'trajectory' }
    }))
  }

  const handleStopTrajectory = () => {
    setSystemStatus(prev => ({
      ...prev,
      gimbal: { ...prev.gimbal, mode: 'idle' }
    }))
  }

  const handleCalibrate = async () => {
    setSystemStatus(prev => ({
      ...prev,
      gimbal: { ...prev.gimbal, mode: 'calibrating' }
    }))
    
    // Simulate calibration
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setSystemStatus(prev => ({
      ...prev,
      gimbal: { ...prev.gimbal, mode: 'idle' }
    }))
  }

  const handleResetPosition = () => {
    setGimbalSettings(prev => ({
      ...prev,
      pan: 0,
      tilt: 0,
      roll: 0
    }))
  }

  return (
    <div className="space-y-6">
      {/* Main Gimbal Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              <CardTitle>DJI Ronin Gimbal Control</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStatus.gimbal.connected ? "default" : "destructive"}>
                {systemStatus.gimbal.connected ? "Connected" : "Disconnected"}
              </Badge>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm">{Math.round(systemStatus.gimbal.battery)}%</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectGimbal}
              >
                {systemStatus.gimbal.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
          <CardDescription>
            Canon R5 Mk II with RF 100mm Macro Lens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="trajectory">Trajectory</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="calibration">Calibration</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6">
              {/* Movement Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Pan: {gimbalSettings.pan}°</Label>
                  <Slider
                    value={[gimbalSettings.pan]}
                    onValueChange={(value) => handleMoveGimbal('pan', value[0])}
                    max={180}
                    min={-180}
                    step={1}
                    disabled={!systemStatus.gimbal.connected}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tilt: {gimbalSettings.tilt}°</Label>
                  <Slider
                    value={[gimbalSettings.tilt]}
                    onValueChange={(value) => handleMoveGimbal('tilt', value[0])}
                    max={90}
                    min={-90}
                    step={1}
                    disabled={!systemStatus.gimbal.connected}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Roll: {gimbalSettings.roll}°</Label>
                  <Slider
                    value={[gimbalSettings.roll]}
                    onValueChange={(value) => handleMoveGimbal('roll', value[0])}
                    max={45}
                    min={-45}
                    step={1}
                    disabled={!systemStatus.gimbal.connected}
                  />
                </div>
              </div>

              {/* Movement Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Speed: {gimbalSettings.speed}</Label>
                  <Slider
                    value={[gimbalSettings.speed]}
                    onValueChange={(value) => setGimbalSettings(prev => ({ ...prev, speed: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    disabled={!systemStatus.gimbal.connected}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Smoothness: {gimbalSettings.smoothness}</Label>
                  <Slider
                    value={[gimbalSettings.smoothness]}
                    onValueChange={(value) => setGimbalSettings(prev => ({ ...prev, smoothness: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    disabled={!systemStatus.gimbal.connected}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleResetPosition}
                  disabled={!systemStatus.gimbal.connected}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Reset Position
                </Button>
                <Button
                  variant="outline"
                  disabled={!systemStatus.gimbal.connected}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Center Subject
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="trajectory" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Trajectory Type</Label>
                    <Select value={trajectory.type} onValueChange={(value) => setTrajectory(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circular">Circular</SelectItem>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="spiral">Spiral</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Radius: {trajectory.radius}m</Label>
                    <Slider
                      value={[trajectory.radius]}
                      onValueChange={(value) => setTrajectory(prev => ({ ...prev, radius: value[0] }))}
                      max={2}
                      min={0.1}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Height: {trajectory.height}m</Label>
                    <Slider
                      value={[trajectory.height]}
                      onValueChange={(value) => setTrajectory(prev => ({ ...prev, height: value[0] }))}
                      max={1}
                      min={0}
                      step={0.1}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Duration: {trajectory.duration}s</Label>
                    <Slider
                      value={[trajectory.duration]}
                      onValueChange={(value) => setTrajectory(prev => ({ ...prev, duration: value[0] }))}
                      max={60}
                      min={5}
                      step={5}
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Trajectory Preview</h4>
                    <div className="aspect-square bg-background rounded-lg flex items-center justify-center">
                      <Move className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleStartTrajectory}
                  disabled={!systemStatus.gimbal.connected || systemStatus.gimbal.mode === 'trajectory'}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Trajectory
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStopTrajectory}
                  disabled={systemStatus.gimbal.mode !== 'trajectory'}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  disabled={!systemStatus.gimbal.connected}
                >
                  <Target className="w-6 h-6 mb-2" />
                  <span>Product Shot</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  disabled={!systemStatus.gimbal.connected}
                >
                  <RotateCcw className="w-6 h-6 mb-2" />
                  <span>360° Rotation</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  disabled={!systemStatus.gimbal.connected}
                >
                  <Move className="w-6 h-6 mb-2" />
                  <span>Orbital Scan</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  disabled={!systemStatus.gimbal.connected}
                >
                  <RotateCw className="w-6 h-6 mb-2" />
                  <span>Top-Down</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  disabled={!systemStatus.gimbal.connected}
                >
                  <Move className="w-6 h-6 mb-2" />
                  <span>Side Profile</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  disabled={!systemStatus.gimbal.connected}
                >
                  <Target className="w-6 h-6 mb-2" />
                  <span>Macro Detail</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="calibration" className="space-y-4">
              <div className="text-center space-y-4">
                <div className="p-8 bg-muted rounded-lg">
                  <RotateCcw className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Gimbal Calibration</h3>
                  <p className="text-muted-foreground mb-4">
                    Calibrate the gimbal for optimal performance and accuracy
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleCalibrate}
                    disabled={!systemStatus.gimbal.connected || systemStatus.gimbal.mode === 'calibrating'}
                  >
                    {systemStatus.gimbal.mode === 'calibrating' ? "Calibrating..." : "Start Calibration"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!systemStatus.gimbal.connected}
                  >
                    Auto-Calibration
                  </Button>
                </div>

                {systemStatus.gimbal.mode === 'calibrating' && (
                  <div className="text-sm text-muted-foreground">
                    Please keep the gimbal stationary during calibration...
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Gimbal Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{gimbalSettings.pan}°</div>
              <div className="text-sm text-muted-foreground">Pan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{gimbalSettings.tilt}°</div>
              <div className="text-sm text-muted-foreground">Tilt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{gimbalSettings.roll}°</div>
              <div className="text-sm text-muted-foreground">Roll</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{systemStatus.gimbal.mode}</div>
              <div className="text-sm text-muted-foreground">Mode</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
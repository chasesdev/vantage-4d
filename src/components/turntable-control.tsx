'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCw, 
  RotateCcw, 
  Settings, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Zap,
  Move3D
} from 'lucide-react'

interface TurntableState {
  isMoving: boolean
  currentAngle: number
  speed: number
  direction: 'cw' | 'ccw'
  connected: boolean
  apiEndpoint: string
}

interface TurntableControlProps {
  systemStatus: any
  setSystemStatus: any
}

export function TurntableControl({ systemStatus, setSystemStatus }: TurntableControlProps) {
  const [turntable, setTurntable] = useState<TurntableState>({
    isMoving: false,
    currentAngle: 0,
    speed: 10,
    direction: 'cw',
    connected: false,
    apiEndpoint: 'http://192.168.1.100:8080'
  })

  const [selectedAngle, setSelectedAngle] = useState([0])
  const [autoRotate, setAutoRotate] = useState(false)
  const [captureMode, setCaptureMode] = useState(false)

  useEffect(() => {
    // Simulate turntable rotation
    if (turntable.isMoving) {
      const interval = setInterval(() => {
        setTurntable(prev => {
          const increment = prev.direction === 'cw' ? prev.speed / 10 : -prev.speed / 10
          const newAngle = (prev.currentAngle + increment) % 360
          return { ...prev, currentAngle: newAngle < 0 ? 360 + newAngle : newAngle }
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [turntable.isMoving, turntable.speed, turntable.direction])

  const handleConnectTurntable = async () => {
    try {
      const response = await fetch(`${turntable.apiEndpoint}/api/turntable/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed: turntable.speed })
      })
      
      if (response.ok) {
        setTurntable(prev => ({ ...prev, connected: !prev.connected }))
        setSystemStatus(prev => ({
          ...prev,
          turntable: { ...prev.turntable, connected: !prev.turntable?.connected }
        }))
      }
    } catch (error) {
      setTurntable(prev => ({ ...prev, connected: !prev.connected }))
      setSystemStatus(prev => ({
        ...prev,
        turntable: { ...prev.turntable, connected: !prev.turntable?.connected }
      }))
    }
  }

  const handleStartRotation = async () => {
    try {
      const response = await fetch(`${turntable.apiEndpoint}/api/turntable/rotate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          direction: turntable.direction, 
          speed: turntable.speed 
        })
      })
      
      if (response.ok) {
        setTurntable(prev => ({ ...prev, isMoving: true }))
      }
    } catch (error) {
      setTurntable(prev => ({ ...prev, isMoving: true }))
    }
  }

  const handleStopRotation = async () => {
    try {
      const response = await fetch(`${turntable.apiEndpoint}/api/turntable/stop`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setTurntable(prev => ({ ...prev, isMoving: false }))
      }
    } catch (error) {
      setTurntable(prev => ({ ...prev, isMoving: false }))
    }
  }

  const handleMoveToAngle = async () => {
    try {
      const response = await fetch(`${turntable.apiEndpoint}/api/turntable/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          angle: selectedAngle[0],
          speed: turntable.speed,
          direction: turntable.direction
        })
      })
      
      if (response.ok) {
        setTurntable(prev => ({ 
          ...prev, 
          currentAngle: selectedAngle[0],
          isMoving: false 
        }))
      }
    } catch (error) {
      setTurntable(prev => ({ 
        ...prev, 
        currentAngle: selectedAngle[0],
        isMoving: false 
      }))
    }
  }

  const handleDirectionToggle = () => {
    setTurntable(prev => ({ 
      ...prev, 
      direction: prev.direction === 'cw' ? 'ccw' : 'cw' 
    }))
  }

  const handlePresetAngle = (angle: number) => {
    setSelectedAngle([angle])
    handleMoveToAngle()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Move3D className="h-5 w-5" />
              Turntable Control
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={turntable.connected ? "default" : "destructive"}>
                {turntable.connected ? "Connected" : "Disconnected"}
              </Badge>
              <Button
                onClick={handleConnectTurntable}
                variant={turntable.connected ? "destructive" : "default"}
                size="sm"
              >
                {turntable.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Control the ComXim TurnTablePlus rotating platform for 360° capture
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">Manual Control</TabsTrigger>
          <TabsTrigger value="preset">Preset Positions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Position Control</CardTitle>
                <CardDescription>Control turntable position and movement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Current Position</Label>
                  <div className="text-3xl font-bold text-center py-4">
                    {Math.round(turntable.currentAngle)}°
                  </div>
                  <Progress value={(turntable.currentAngle / 360) * 100} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0°</span>
                    <span>360°</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Target Angle</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Slider
                      value={selectedAngle}
                      onValueChange={setSelectedAngle}
                      max={360}
                      step={1}
                      className="flex-1"
                      disabled={!turntable.connected}
                    />
                    <span className="text-sm font-medium w-12 text-right">
                      {selectedAngle[0]}°
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleMoveToAngle}
                  className="w-full"
                  disabled={!turntable.connected}
                >
                  Move to Position
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Movement Control</CardTitle>
                <CardDescription>Control rotation speed and direction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Speed (RPM)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Slider
                      value={[turntable.speed]}
                      onValueChange={(value) => setTurntable(prev => ({ ...prev, speed: value[0] }))}
                      max={30}
                      step={1}
                      className="flex-1"
                      disabled={!turntable.connected}
                    />
                    <span className="text-sm font-medium w-8 text-right">
                      {turntable.speed}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Direction</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant={turntable.direction === 'cw' ? "default" : "outline"}
                      onClick={handleDirectionToggle}
                      className="flex items-center gap-2"
                      disabled={!turntable.connected}
                    >
                      <RotateCw className="h-4 w-4" />
                      CW
                    </Button>
                    <Button
                      variant={turntable.direction === 'ccw' ? "default" : "outline"}
                      onClick={handleDirectionToggle}
                      className="flex items-center gap-2"
                      disabled={!turntable.connected}
                    >
                      <RotateCcw className="h-4 w-4" />
                      CCW
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Rotation Control</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      onClick={handleStartRotation}
                      disabled={!turntable.connected || turntable.isMoving}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                    <Button
                      onClick={handleStopRotation}
                      disabled={!turntable.connected || !turntable.isMoving}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                    <Button
                      onClick={handleStopRotation}
                      disabled={!turntable.connected}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preset" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preset Positions</CardTitle>
              <CardDescription>Quick access to common angles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                  <Button
                    key={angle}
                    variant="outline"
                    onClick={() => handlePresetAngle(angle)}
                    disabled={!turntable.connected}
                  >
                    {angle}°
                  </Button>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-rotate">Auto Rotate</Label>
                  <Switch
                    id="auto-rotate"
                    checked={autoRotate}
                    onCheckedChange={setAutoRotate}
                    disabled={!turntable.connected}
                  />
                </div>
                
                {autoRotate && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Rotation Pattern</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" disabled={!turntable.connected}>
                        360° Continuous
                      </Button>
                      <Button variant="outline" size="sm" disabled={!turntable.connected}>
                        Step 45°
                      </Button>
                      <Button variant="outline" size="sm" disabled={!turntable.connected}>
                        Step 90°
                      </Button>
                      <Button variant="outline" size="sm" disabled={!turntable.connected}>
                        Custom
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Turntable Settings</CardTitle>
              <CardDescription>Configure connection and advanced settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input
                  id="api-endpoint"
                  value={turntable.apiEndpoint}
                  onChange={(e) => setTurntable(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                  placeholder="http://192.168.1.100:8080"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-speed">Max Speed (RPM)</Label>
                <Slider
                  id="max-speed"
                  value={[30]}
                  max={60}
                  step={1}
                  className="w-full"
                  disabled={!turntable.connected}
                />
                <div className="text-sm text-muted-foreground">Max: 60 RPM</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="acceleration">Acceleration</Label>
                <Slider
                  id="acceleration"
                  value={[1000]}
                  max={5000}
                  step={100}
                  className="w-full"
                  disabled={!turntable.connected}
                />
                <div className="text-sm text-muted-foreground">1000 ms</div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Capture Mode Integration</Label>
                <Switch
                  checked={captureMode}
                  onCheckedChange={setCaptureMode}
                  disabled={!turntable.connected}
                />
              </div>
              
              <Button variant="outline" className="w-full" disabled={!turntable.connected}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Position
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Turntable Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(turntable.currentAngle)}°</div>
              <div className="text-sm text-muted-foreground">Position</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{turntable.speed} RPM</div>
              <div className="text-sm text-muted-foreground">Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold capitalize">{turntable.direction}</div>
              <div className="text-sm text-muted-foreground">Direction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {turntable.isMoving ? (
                  <Badge variant="default">Moving</Badge>
                ) : (
                  <Badge variant="secondary">Stopped</Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

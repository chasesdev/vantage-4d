"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Activity, AlertTriangle, Users, Eye, Settings, Play, Pause, RotateCw } from 'lucide-react'

export function ToFMonitoring() {
  const [tofStatus, setTofStatus] = useState({
    connected: false,
    cameras: [
      { id: 1, name: 'Front ToF', position: { x: 0, y: 0, z: 0 }, detecting: false, people: 0 },
      { id: 2, name: 'Side ToF', position: { x: 1, y: 0, z: 0 }, detecting: false, people: 0 }
    ],
    monitoring: {
      active: false,
      sensitivity: 0.7,
      alertDistance: 0.5,
      maxDepth: 5.0
    },
    alerts: []
  })

  const [depthMap, setDepthMap] = useState(null)
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (tofStatus.monitoring.active) {
        setTofStatus(prev => ({
          ...prev,
          cameras: prev.cameras.map(camera => ({
            ...camera,
            people: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0
          }))
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [tofStatus.monitoring.active])

  const handleConnectToF = async () => {
    setTofStatus(prev => ({
      ...prev,
      connected: !prev.connected,
      cameras: prev.cameras.map(camera => ({
        ...camera,
        detecting: !prev.connected
      }))
    }))
  }

  const handleStartMonitoring = async () => {
    setTofStatus(prev => ({
      ...prev,
      monitoring: { ...prev.monitoring, active: true }
    }))
    setIsMonitoring(true)

    // Simulate monitoring alerts
    setTimeout(() => {
      if (Math.random() > 0.7) {
        setTofStatus(prev => ({
          ...prev,
          alerts: [
            ...prev.alerts,
            {
              id: Date.now(),
              type: 'warning',
              camera: 'Front ToF',
              message: 'Person detected at 0.3m - Front ToF',
              distance: 0.3,
              timestamp: new Date().toISOString()
            }
          ]
        }))
      }
    }, 5000)
  }

  const handleStopMonitoring = () => {
    setTofStatus(prev => ({
      ...prev,
      monitoring: { ...prev.monitoring, active: false }
    }))
    setIsMonitoring(false)
  }

  const handleCaptureDepthMap = async () => {
    // Simulate depth map capture
    const mockDepthMap = {
      width: 640,
      height: 480,
      timestamp: new Date().toISOString(),
      maxDepth: tofStatus.monitoring.maxDepth
    }
    setDepthMap(mockDepthMap)
  }

  const handleClearAlerts = () => {
    setTofStatus(prev => ({ ...prev, alerts: [] }))
  }

  const handleUpdateSettings = (key: string, value: any) => {
    setTofStatus(prev => ({
      ...prev,
      monitoring: { ...prev.monitoring, [key]: value }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Main ToF Monitoring */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <CardTitle>ToF Camera Monitoring</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={tofStatus.connected ? "default" : "destructive"}>
                {tofStatus.connected ? "Connected" : "Disconnected"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectToF}
              >
                {tofStatus.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
          <CardDescription>
            Luxonis ToF Cameras for Patient Safety Monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monitoring" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="cameras">Cameras</TabsTrigger>
              <TabsTrigger value="depth">Depth Map</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="space-y-4">
              {/* Monitoring Control */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">Patient Safety Monitoring</div>
                  <div className="text-sm text-muted-foreground">
                    {tofStatus.monitoring.active ? "Monitoring active" : "Monitoring stopped"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={tofStatus.monitoring.active ? handleStopMonitoring : handleStartMonitoring}
                    variant={tofStatus.monitoring.active ? "destructive" : "default"}
                    disabled={!tofStatus.connected}
                  >
                    {tofStatus.monitoring.active ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Monitoring
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Monitoring
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Real-time Detection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tofStatus.cameras.map((camera) => (
                  <Card key={camera.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{camera.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Status</span>
                          <Badge variant={camera.detecting ? "default" : "secondary"}>
                            {camera.detecting ? "Detecting" : "Idle"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">People Detected</span>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="text-lg font-bold">{camera.people}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Position: ({camera.position.x}, {camera.position.y}, {camera.position.z})
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Alerts */}
              {tofStatus.alerts.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Safety Alerts</CardTitle>
                      <Button variant="outline" size="sm" onClick={handleClearAlerts}>
                        Clear Alerts
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tofStatus.alerts.map((alert) => (
                        <Alert key={alert.id} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex items-center justify-between">
                              <span>{alert.message}</span>
                              <span className="text-xs opacity-75">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cameras" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tofStatus.cameras.map((camera) => (
                  <Card key={camera.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{camera.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm opacity-75">
                            {camera.detecting ? "Depth sensing active" : "Camera not detecting"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Status:</span>
                          <p>{camera.detecting ? "Active" : "Inactive"}</p>
                        </div>
                        <div>
                          <span className="font-medium">People:</span>
                          <p>{camera.people}</p>
                        </div>
                        <div>
                          <span className="font-medium">Position X:</span>
                          <p>{camera.position.x}m</p>
                        </div>
                        <div>
                          <span className="font-medium">Position Y:</span>
                          <p>{camera.position.y}m</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor={`detecting-${camera.id}`}>Detecting</Label>
                        <Switch
                          id={`detecting-${camera.id}`}
                          checked={camera.detecting}
                          onCheckedChange={(checked) => {
                            setTofStatus(prev => ({
                              ...prev,
                              cameras: prev.cameras.map(c =>
                                c.id === camera.id ? { ...c, detecting: checked } : c
                              )
                            }))
                          }}
                          disabled={!tofStatus.connected}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="depth" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Depth Map Visualization</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time depth sensing from ToF cameras
                  </p>
                </div>
                <Button
                  onClick={handleCaptureDepthMap}
                  disabled={!tofStatus.connected}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Capture Depth Map
                </Button>
              </div>

              {depthMap ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Depth Map Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Activity className="w-16 h-16 mx-auto mb-4 opacity-75" />
                        <p className="text-lg font-medium mb-2">Depth Map Captured</p>
                        <p className="text-sm opacity-75">
                          Resolution: {depthMap.width}x{depthMap.height}
                        </p>
                        <p className="text-sm opacity-75">
                          Max Depth: {depthMap.maxDepth}m
                        </p>
                        <p className="text-xs opacity-75 mt-2">
                          {new Date(depthMap.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">No Depth Map Available</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Capture Depth Map" to generate depth visualization
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detection Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sensitivity">Sensitivity: {tofStatus.monitoring.sensitivity}</Label>
                  <Slider
                    value={[tofStatus.monitoring.sensitivity]}
                    onValueChange={(value) => handleUpdateSettings('sensitivity', value[0])}
                    max={1}
                    min={0.1}
                    step={0.1}
                    disabled={!tofStatus.connected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alertDistance">Alert Distance: {tofStatus.monitoring.alertDistance}m</Label>
                  <Slider
                    value={[tofStatus.monitoring.alertDistance]}
                    onValueChange={(value) => handleUpdateSettings('alertDistance', value[0])}
                    max={2}
                    min={0.1}
                    step={0.1}
                    disabled={!tofStatus.connected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDepth">Max Depth Range: {tofStatus.monitoring.maxDepth}m</Label>
                  <Slider
                    value={[tofStatus.monitoring.maxDepth]}
                    onValueChange={(value) => handleUpdateSettings('maxDepth', value[0])}
                    max={10}
                    min={1}
                    step={0.5}
                    disabled={!tofStatus.connected}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Interface:</span>
                    <span>USB 3.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protocol:</span>
                    <span>DepthAI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span>640x480</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frame Rate:</span>
                    <span>30 fps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span>±1cm</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" disabled={!tofStatus.connected}>
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
</div>
)
}
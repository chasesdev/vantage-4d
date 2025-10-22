"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Video, Settings, Focus, Zap, Aperture, Timer } from 'lucide-react'

interface CameraControlPanelProps {
  systemStatus: any
  setSystemStatus: any
}

export function CameraControlPanel({ systemStatus, setSystemStatus }: CameraControlPanelProps) {
  const [r5cSettings, setR5cSettings] = useState({
    resolution: '8K',
    frameRate: '60fps',
    codec: 'H.265',
    cleanHDMI: true,
    recordingMode: 'manual'
  })

  const [r5m2Settings, setR5m2Settings] = useState({
    iso: 100,
    aperture: 8,
    shutterSpeed: '1/125',
    focusMode: 'manual',
    focusStacking: true,
    stackFrames: 15,
    stackStep: 0.1
  })

  const handleConnectR5C = async () => {
    // Simulate connection
    setSystemStatus(prev => ({
      ...prev,
      r5c: { ...prev.r5c, connected: !prev.r5c.connected }
    }))
  }

  const handleConnectR5M2 = async () => {
    // Simulate connection
    setSystemStatus(prev => ({
      ...prev,
      r5m2: { ...prev.r5m2, connected: !prev.r5m2.connected }
    }))
  }

  const handleStartRecording = () => {
    setSystemStatus(prev => ({
      ...prev,
      r5c: { ...prev.r5c, recording: true, mode: 'recording' }
    }))
  }

  const handleStopRecording = () => {
    setSystemStatus(prev => ({
      ...prev,
      r5c: { ...prev.r5c, recording: false, mode: 'standby' }
    }))
  }

  const handleFocusStack = async () => {
    setSystemStatus(prev => ({
      ...prev,
      r5m2: { ...prev.r5m2, capturing: true, focusStack: 0 }
    }))

    // Simulate focus stacking
    for (let i = 0; i <= r5m2Settings.stackFrames; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSystemStatus(prev => ({
        ...prev,
        r5m2: { ...prev.r5m2, focusStack: i }
      }))
    }

    setSystemStatus(prev => ({
      ...prev,
      r5m2: { ...prev.r5m2, capturing: false }
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Canon R5C - 8K Video */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <CardTitle>Canon R5C (8K Video)</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStatus.r5c.connected ? "default" : "destructive"}>
                {systemStatus.r5c.connected ? "Connected" : "Disconnected"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectR5C}
              >
                {systemStatus.r5c.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
          <CardDescription>
            Yuan SC750N1 HDMI 2.1 Capture Card - 8K@60fps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="capture">Capture</TabsTrigger>
              <TabsTrigger value="monitor">Monitor</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resolution">Resolution</Label>
                  <Select value={r5cSettings.resolution} onValueChange={(value) => setR5cSettings(prev => ({ ...prev, resolution: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8K">8K (7680×4320)</SelectItem>
                      <SelectItem value="4K">4K (3840×2160)</SelectItem>
                      <SelectItem value="1080p">1080p (1920×1080)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frameRate">Frame Rate</Label>
                  <Select value={r5cSettings.frameRate} onValueChange={(value) => setR5cSettings(prev => ({ ...prev, frameRate: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60fps">60 fps</SelectItem>
                      <SelectItem value="30fps">30 fps</SelectItem>
                      <SelectItem value="24fps">24 fps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="codec">Codec</Label>
                <Select value={r5cSettings.codec} onValueChange={(value) => setR5cSettings(prev => ({ ...prev, codec: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="H.265">H.265 (HEVC)</SelectItem>
                    <SelectItem value="H.264">H.264 (AVC)</SelectItem>
                    <SelectItem value="RAW">RAW (Lightweight)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="cleanHDMI">Clean HDMI Output</Label>
                <Switch
                  id="cleanHDMI"
                  checked={r5cSettings.cleanHDMI}
                  onCheckedChange={(checked) => setR5cSettings(prev => ({ ...prev, cleanHDMI: checked }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="capture" className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">Recording Status</div>
                  <div className="text-sm text-muted-foreground">
                    {systemStatus.r5c.recording ? "Recording in progress..." : "Ready to record"}
                  </div>
                </div>
                <Button
                  variant={systemStatus.r5c.recording ? "destructive" : "default"}
                  onClick={systemStatus.r5c.recording ? handleStopRecording : handleStartRecording}
                  disabled={!systemStatus.r5c.connected}
                >
                  {systemStatus.r5c.recording ? "Stop Recording" : "Start Recording"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recordingMode">Recording Mode</Label>
                  <Select value={r5cSettings.recordingMode} onValueChange={(value) => setR5cSettings(prev => ({ ...prev, recordingMode: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="interval">Interval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bitrate">Bitrate (Mbps)</Label>
                  <Input type="number" defaultValue="800" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monitor" className="space-y-4">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">
                    {systemStatus.r5c.connected ? "8K Video Preview" : "Camera Not Connected"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Input Source:</span>
                  <p className="text-muted-foreground">HDMI 2.1</p>
                </div>
                <div>
                  <span className="font-medium">Capture Card:</span>
                  <p className="text-muted-foreground">Yuan SC750N1</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Canon R5 Mk II - Macro Photography */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <CardTitle>Canon R5 Mk II (Macro)</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStatus.r5m2.connected ? "default" : "destructive"}>
                {systemStatus.r5m2.connected ? "Connected" : "Disconnected"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectR5M2}
              >
                {systemStatus.r5m2.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
          <CardDescription>
            RF 100mm Macro Lens on DJI Ronin Gimbal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="exposure" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="exposure">Exposure</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="capture">Capture</TabsTrigger>
            </TabsList>

            <TabsContent value="exposure" className="space-y-4">
              <div>
                <Label htmlFor="iso">ISO: {r5m2Settings.iso}</Label>
                <Slider
                  value={[r5m2Settings.iso]}
                  onValueChange={(value) => setR5m2Settings(prev => ({ ...prev, iso: value[0] }))}
                  max={25600}
                  min={100}
                  step={100}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="aperture">Aperture: f/{r5m2Settings.aperture}</Label>
                <Slider
                  value={[r5m2Settings.aperture]}
                  onValueChange={(value) => setR5m2Settings(prev => ({ ...prev, aperture: value[0] }))}
                  max={32}
                  min={1.4}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="shutterSpeed">Shutter Speed</Label>
                <Select value={r5m2Settings.shutterSpeed} onValueChange={(value) => setR5m2Settings(prev => ({ ...prev, shutterSpeed: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1/8000">1/8000</SelectItem>
                    <SelectItem value="1/4000">1/4000</SelectItem>
                    <SelectItem value="1/2000">1/2000</SelectItem>
                    <SelectItem value="1/1000">1/1000</SelectItem>
                    <SelectItem value="1/500">1/500</SelectItem>
                    <SelectItem value="1/250">1/250</SelectItem>
                    <SelectItem value="1/125">1/125</SelectItem>
                    <SelectItem value="1/60">1/60</SelectItem>
                    <SelectItem value="1/30">1/30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="focus" className="space-y-4">
              <div>
                <Label htmlFor="focusMode">Focus Mode</Label>
                <Select value={r5m2Settings.focusMode} onValueChange={(value) => setR5m2Settings(prev => ({ ...prev, focusMode: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Focus</SelectItem>
                    <SelectItem value="auto">Auto Focus</SelectItem>
                    <SelectItem value="macro">Macro Focus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="focusStacking">Focus Stacking</Label>
                <Switch
                  id="focusStacking"
                  checked={r5m2Settings.focusStacking}
                  onCheckedChange={(checked) => setR5m2Settings(prev => ({ ...prev, focusStacking: checked }))}
                />
              </div>

              {r5m2Settings.focusStacking && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="stackFrames">Stack Frames: {r5m2Settings.stackFrames}</Label>
                    <Slider
                      value={[r5m2Settings.stackFrames]}
                      onValueChange={(value) => setR5m2Settings(prev => ({ ...prev, stackFrames: value[0] }))}
                      max={100}
                      min={3}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stackStep">Step Size: {r5m2Settings.stackStep}mm</Label>
                    <Slider
                      value={[r5m2Settings.stackStep]}
                      onValueChange={(value) => setR5m2Settings(prev => ({ ...prev, stackStep: value[0] }))}
                      max={1}
                      min={0.01}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="capture" className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">Focus Stack Progress</div>
                  <div className="text-sm text-muted-foreground">
                    {systemStatus.r5m2.capturing 
                      ? `Capturing frame ${systemStatus.r5m2.focusStack} of ${r5m2Settings.stackFrames}`
                      : "Ready to capture"
                    }
                  </div>
                </div>
                <Button
                  onClick={handleFocusStack}
                  disabled={!systemStatus.r5m2.connected || systemStatus.r5m2.capturing}
                >
                  {systemStatus.r5m2.capturing ? "Capturing..." : "Start Focus Stack"}
                </Button>
              </div>

              {systemStatus.r5m2.capturing && (
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(systemStatus.r5m2.focusStack / r5m2Settings.stackFrames) * 100}%` }}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Lens:</span>
                  <p className="text-muted-foreground">RF 100mm f/2.8L Macro</p>
                </div>
                <div>
                  <span className="font-medium">Mount:</span>
                  <p className="text-muted-foreground">DJI Ronin Gimbal</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
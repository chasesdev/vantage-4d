"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Zap, Sun, Palette, Save, Play, Power } from 'lucide-react'

export function LightingControl() {
  const [dmxConnected, setDmxConnected] = useState(true)
  const [activeScene, setActiveScene] = useState('neutral')
  
  const [lights, setLights] = useState([
    { id: 1, name: 'Key Light', intensity: 75, color: '#FFFFFF', temperature: 5600, enabled: true },
    { id: 2, name: 'Fill Light', intensity: 50, color: '#FFFFFF', temperature: 5600, enabled: true },
    { id: 3, name: 'Back Light', intensity: 30, color: '#FFFFFF', temperature: 3200, enabled: true },
    { id: 4, name: 'Top Light', intensity: 40, color: '#FFFFFF', temperature: 5600, enabled: false }
  ])

  const [scenes, setScenes] = useState([
    { id: 'neutral', name: 'Neutral Lighting', icon: Sun },
    { id: 'macro', name: 'Macro Photography', icon: Zap },
    { id: 'dramatic', name: 'Dramatic', icon: Palette },
    { id: 'product', name: 'Product Shot', icon: Sun }
  ])

  const [dmxSettings, setDmxSettings] = useState({
    universe: 1,
    refreshRate: 40,
    transitionTime: 1000
  })

  const handleLightChange = (lightId: number, property: string, value: any) => {
    setLights(prev => prev.map(light => 
      light.id === lightId ? { ...light, [property]: value } : light
    ))
  }

  const handleSceneChange = (sceneId: string) => {
    setActiveScene(sceneId)
    
    // Apply scene presets
    const scenePresets = {
      neutral: [
        { id: 1, intensity: 75, temperature: 5600 },
        { id: 2, intensity: 50, temperature: 5600 },
        { id: 3, intensity: 30, temperature: 3200 },
        { id: 4, intensity: 40, temperature: 5600 }
      ],
      macro: [
        { id: 1, intensity: 90, temperature: 5600 },
        { id: 2, intensity: 70, temperature: 5600 },
        { id: 3, intensity: 20, temperature: 3200 },
        { id: 4, intensity: 60, temperature: 5600 }
      ],
      dramatic: [
        { id: 1, intensity: 100, temperature: 3200 },
        { id: 2, intensity: 20, temperature: 5600 },
        { id: 3, intensity: 50, temperature: 3200 },
        { id: 4, intensity: 0, temperature: 5600 }
      ],
      product: [
        { id: 1, intensity: 80, temperature: 5600 },
        { id: 2, intensity: 60, temperature: 5600 },
        { id: 3, intensity: 40, temperature: 5600 },
        { id: 4, intensity: 80, temperature: 5600 }
      ]
    }

    const preset = scenePresets[sceneId as keyof typeof scenePresets]
    if (preset) {
      setLights(prev => prev.map(light => {
        const presetLight = preset.find(p => p.id === light.id)
        return presetLight ? { ...light, intensity: presetLight.intensity, temperature: presetLight.temperature } : light
      }))
    }
  }

  const handleToggleAllLights = (enabled: boolean) => {
    setLights(prev => prev.map(light => ({ ...light, enabled })))
  }

  const handleSaveScene = () => {
    const newScene = {
      id: `custom_${Date.now()}`,
      name: 'Custom Scene',
      icon: Palette
    }
    setScenes(prev => [...prev, newScene])
  }

  const handleConnectDMX = () => {
    setDmxConnected(!dmxConnected)
  }

  return (
    <div className="space-y-6">
      {/* DMX Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <CardTitle>DMX Lighting Control</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={dmxConnected ? "default" : "destructive"}>
                {dmxConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectDMX}
              >
                <Power className="w-4 h-4 mr-2" />
                {dmxConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
          <CardDescription>
            Godox DMX Lighting System for Professional Photography
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scenes" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scenes">Scenes</TabsTrigger>
              <TabsTrigger value="lights">Individual Lights</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>

            <TabsContent value="scenes" className="space-y-4">
              {/* Scene Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {scenes.map((scene) => {
                  const IconComponent = scene.icon
                  return (
                    <Button
                      key={scene.id}
                      variant={activeScene === scene.id ? "default" : "outline"}
                      className="h-20 flex-col"
                      onClick={() => handleSceneChange(scene.id)}
                      disabled={!dmxConnected}
                    >
                      <IconComponent className="w-6 h-6 mb-2" />
                      <span className="text-sm">{scene.name}</span>
                    </Button>
                  )
                })}
              </div>

              {/* Current Scene Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Scene: {scenes.find(s => s.id === activeScene)?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {lights.map((light) => (
                      <div key={light.id} className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                          light.enabled ? 'bg-yellow-400' : 'bg-gray-300'
                        }`} />
                        <div className="text-sm font-medium">{light.name}</div>
                        <div className="text-xs text-muted-foreground">{light.intensity}%</div>
                        <div className="text-xs text-muted-foreground">{light.temperature}K</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveScene} disabled={!dmxConnected}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Current Scene
                </Button>
                <Button variant="outline" onClick={() => handleToggleAllLights(true)} disabled={!dmxConnected}>
                  <Power className="w-4 h-4 mr-2" />
                  All Lights On
                </Button>
                <Button variant="outline" onClick={() => handleToggleAllLights(false)} disabled={!dmxConnected}>
                  <Power className="w-4 h-4 mr-2" />
                  All Lights Off
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="lights" className="space-y-4">
              {/* Individual Light Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lights.map((light) => (
                  <Card key={light.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{light.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            light.enabled ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <Switch
                            checked={light.enabled}
                            onCheckedChange={(enabled) => handleLightChange(light.id, 'enabled', enabled)}
                            disabled={!dmxConnected}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Intensity: {light.intensity}%</Label>
                        <Slider
                          value={[light.intensity]}
                          onValueChange={(value) => handleLightChange(light.id, 'intensity', value[0])}
                          max={100}
                          min={0}
                          step={1}
                          disabled={!dmxConnected || !light.enabled}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Color Temperature: {light.temperature}K</Label>
                        <Slider
                          value={[light.temperature]}
                          onValueChange={(value) => handleLightChange(light.id, 'temperature', value[0])}
                          max={6500}
                          min={2700}
                          step={100}
                          disabled={!dmxConnected || !light.enabled}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="color">Color</Label>
                          <input
                            type="color"
                            id="color"
                            value={light.color}
                            onChange={(e) => handleLightChange(light.id, 'color', e.target.value)}
                            className="w-full h-10 rounded cursor-pointer"
                            disabled={!dmxConnected || !light.enabled}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dmx-channel">DMX Channel</Label>
                          <input
                            type="number"
                            id="dmx-channel"
                            value={light.id * 3}
                            className="w-full h-10 rounded px-2 border"
                            disabled
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">DMX Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="universe">Universe</Label>
                      <Select value={dmxSettings.universe.toString()} onValueChange={(value) => setDmxSettings(prev => ({ ...prev, universe: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Universe 1</SelectItem>
                          <SelectItem value="2">Universe 2</SelectItem>
                          <SelectItem value="3">Universe 3</SelectItem>
                          <SelectItem value="4">Universe 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Refresh Rate: {dmxSettings.refreshRate} Hz</Label>
                      <Slider
                        value={[dmxSettings.refreshRate]}
                        onValueChange={(value) => setDmxSettings(prev => ({ ...prev, refreshRate: value[0] }))}
                        max={60}
                        min={10}
                        step={5}
                        disabled={!dmxConnected}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Transition Time: {dmxSettings.transitionTime}ms</Label>
                      <Slider
                        value={[dmxSettings.transitionTime]}
                        onValueChange={(value) => setDmxSettings(prev => ({ ...prev, transitionTime: value[0] }))}
                        max={5000}
                        min={0}
                        step={100}
                        disabled={!dmxConnected}
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
                        <span>USB-DMX Pro</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protocol:</span>
                        <span>DMX512</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Channels:</span>
                        <span>512</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connected Devices:</span>
                        <span>{lights.filter(l => l.enabled).length}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" disabled={!dmxConnected}>
                      <Play className="w-4 h-4 mr-2" />
                      Test DMX Signal
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Automated Lighting Sequences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-16 flex-col" disabled={!dmxConnected}>
                      <Play className="w-6 h-6 mb-2" />
                      <span>Capture Sequence</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col" disabled={!dmxConnected}>
                      <Sun className="w-6 h-6 mb-2" />
                      <span>Daylight Simulation</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col" disabled={!dmxConnected}>
                      <Palette className="w-6 h-6 mb-2" />
                      <span>Color Cycle</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col" disabled={!dmxConnected}>
                      <Zap className="w-6 h-6 mb-2" />
                      <span>Strobe Effect</span>
                    </Button>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Sync with Camera</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automatically adjust lighting based on camera settings and capture mode
                    </p>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-sync">Auto-sync with capture</Label>
                      <Switch id="auto-sync" disabled={!dmxConnected} />
                    </div>
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
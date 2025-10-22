"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { RotateCw, Play, Pause, Download, Settings, Box, Zap, Eye, Layers } from 'lucide-react'

interface Reconstruction3DProps {
  systemStatus: any
  setSystemStatus: any
}

export function Reconstruction3D({ systemStatus, setSystemStatus }: Reconstruction3DProps) {
  const [reconstructionSettings, setReconstructionSettings] = useState({
    method: 'gaussian-splatting',
    quality: 'high',
    resolution: '4K',
    frameCount: 0,
    useDepthData: true,
    useVideoFrames: true,
    useStillImages: true,
    smoothing: 0.5,
    density: 1000
  })

  const [reconstructionProgress, setReconstructionProgress] = useState({
    stage: 'idle',
    progress: 0,
    currentStep: '',
    estimatedTime: 0,
    processingTime: 0
  })

  const [modelStats, setModelStats] = useState({
    vertices: 0,
    faces: 0,
    splats: 0,
    fileSize: 0,
    renderTime: 0
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (reconstructionProgress.stage === 'processing') {
      interval = setInterval(() => {
        setReconstructionProgress(prev => {
          const newProgress = Math.min(100, prev.progress + Math.random() * 5)
          if (newProgress >= 100) {
            setModelStats({
              vertices: Math.floor(Math.random() * 1000000) + 500000,
              faces: Math.floor(Math.random() * 2000000) + 1000000,
              splats: Math.floor(Math.random() * 5000000) + 2000000,
              fileSize: Math.floor(Math.random() * 500) + 100,
              renderTime: Math.floor(Math.random() * 16) + 4
            })
            setSystemStatus(prev => ({
              ...prev,
              reconstruction: { status: 'completed', progress: 100 }
            }))
            return { ...prev, stage: 'completed', progress: 100 }
          }
          return { ...prev, progress: newProgress, processingTime: prev.processingTime + 1 }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [reconstructionProgress.stage, setSystemStatus])

  const handleStartReconstruction = async () => {
    setReconstructionProgress({
      stage: 'processing',
      progress: 0,
      currentStep: 'Initializing...',
      estimatedTime: 300,
      processingTime: 0
    })
    
    setSystemStatus(prev => ({
      ...prev,
      reconstruction: { status: 'processing', progress: 0 }
    }))

    // Simulate processing stages
    const stages = [
      'Loading frames...',
      'Feature extraction...',
      'Depth estimation...',
      'Point cloud generation...',
      'Gaussian splatting optimization...',
      'Texture mapping...',
      'Final rendering...'
    ]

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setReconstructionProgress(prev => ({
        ...prev,
        currentStep: stages[i]
      }))
    }
  }

  const handleStopReconstruction = () => {
    setReconstructionProgress({
      stage: 'idle',
      progress: 0,
      currentStep: '',
      estimatedTime: 0,
      processingTime: 0
    })
    
    setSystemStatus(prev => ({
      ...prev,
      reconstruction: { status: 'idle', progress: 0 }
    }))
  }

  const handleExportModel = (format: string) => {
    console.log(`Exporting model as ${format}`)
  }

  return (
    <div className="space-y-6">
      {/* Main Reconstruction Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5" />
              <CardTitle>3D Reconstruction</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={
                reconstructionProgress.stage === 'processing' ? 'destructive' :
                reconstructionProgress.stage === 'completed' ? 'default' : 'secondary'
              }>
                {reconstructionProgress.stage === 'processing' ? 'Processing' :
                 reconstructionProgress.stage === 'completed' ? 'Completed' : 'Ready'}
              </Badge>
            </div>
          </div>
          <CardDescription>
            Gaussian Splatting for High-Fidelity 3D Reconstruction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="control" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="control">Control</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="control" className="space-y-4">
              {/* Reconstruction Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reconstruction Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reconstructionProgress.stage === 'processing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{reconstructionProgress.currentStep}</span>
                          <span>{Math.round(reconstructionProgress.progress)}%</span>
                        </div>
                        <Progress value={reconstructionProgress.progress} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          Processing time: {reconstructionProgress.processingTime}s
                        </div>
                      </div>
                    )}

                    {reconstructionProgress.stage === 'completed' && (
                      <div className="space-y-2">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Zap className="w-8 h-8 mx-auto mb-2 text-green-500" />
                          <p className="font-medium text-green-700 dark:text-green-300">
                            Reconstruction Complete!
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Vertices:</span>
                            <p>{modelStats.vertices.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Faces:</span>
                            <p>{modelStats.faces.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Splats:</span>
                            <p>{modelStats.splats.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">File Size:</span>
                            <p>{modelStats.fileSize} MB</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {reconstructionProgress.stage === 'idle' && (
                      <div className="text-center p-4">
                        <Box className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Ready to start 3D reconstruction
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {reconstructionProgress.stage === 'idle' && (
                        <Button
                          onClick={handleStartReconstruction}
                          className="flex-1"
                          disabled={systemStatus.capture.frames < 10}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Reconstruction
                        </Button>
                      )}
                      {reconstructionProgress.stage === 'processing' && (
                        <Button
                          onClick={handleStopReconstruction}
                          variant="destructive"
                          className="flex-1"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Processing
                        </Button>
                      )}
                      {reconstructionProgress.stage === 'completed' && (
                        <Button
                          onClick={handleStartReconstruction}
                          variant="outline"
                          className="flex-1"
                        >
                          <RotateCw className="w-4 h-4 mr-2" />
                          Reconstruct Again
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Input Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">Video Frames</span>
                        </div>
                        <Badge variant={reconstructionSettings.useVideoFrames ? "default" : "secondary"}>
                          {systemStatus.capture.frames} frames
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          <span className="font-medium">Still Images</span>
                        </div>
                        <Badge variant={reconstructionSettings.useStillImages ? "default" : "secondary"}>
                          {systemStatus.r5m2.focusStack} images
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4" />
                          <span className="font-medium">Depth Data</span>
                        </div>
                        <Badge variant={reconstructionSettings.useDepthData ? "default" : "secondary"}>
                          Available
                        </Badge>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Estimated processing time: ~5 minutes</p>
                      <p>GPU: RTX 6000 Blackwell</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="method">Reconstruction Method</Label>
                    <Select value={reconstructionSettings.method} onValueChange={(value) => setReconstructionSettings(prev => ({ ...prev, method: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gaussian-splatting">Gaussian Splatting</SelectItem>
                        <SelectItem value="neural-radiance">Neural Radiance Fields</SelectItem>
                        <SelectItem value="photogrammetry">Photogrammetry</SelectItem>
                        <SelectItem value="hybrid">Hybrid 3D-4D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quality">Quality</Label>
                    <Select value={reconstructionSettings.quality} onValueChange={(value) => setReconstructionSettings(prev => ({ ...prev, quality: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ultra">Ultra (8K)</SelectItem>
                        <SelectItem value="high">High (4K)</SelectItem>
                        <SelectItem value="medium">Medium (2K)</SelectItem>
                        <SelectItem value="low">Low (1080p)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="useVideoFrames">Use Video Frames</Label>
                      <input
                        type="checkbox"
                        id="useVideoFrames"
                        checked={reconstructionSettings.useVideoFrames}
                        onChange={(e) => setReconstructionSettings(prev => ({ ...prev, useVideoFrames: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="useStillImages">Use Still Images</Label>
                      <input
                        type="checkbox"
                        id="useStillImages"
                        checked={reconstructionSettings.useStillImages}
                        onChange={(e) => setReconstructionSettings(prev => ({ ...prev, useStillImages: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="useDepthData">Use Depth Data</Label>
                      <input
                        type="checkbox"
                        id="useDepthData"
                        checked={reconstructionSettings.useDepthData}
                        onChange={(e) => setReconstructionSettings(prev => ({ ...prev, useDepthData: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="density">Point Density: {reconstructionSettings.density}</Label>
                    <Slider
                      value={[reconstructionSettings.density]}
                      onValueChange={(value) => setReconstructionSettings(prev => ({ ...prev, density: value[0] }))}
                      max={5000}
                      min={100}
                      step={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smoothing">Smoothing: {reconstructionSettings.smoothing}</Label>
                    <Slider
                      value={[reconstructionSettings.smoothing]}
                      onValueChange={(value) => setReconstructionSettings(prev => ({ ...prev, smoothing: value[0] }))}
                      max={1}
                      min={0}
                      step={0.1}
                    />
                  </div>

                  <div>
                    <Label htmlFor="frameCount">Frame Count</Label>
                    <Input
                      type="number"
                      value={reconstructionSettings.frameCount}
                      onChange={(e) => setReconstructionSettings(prev => ({ ...prev, frameCount: parseInt(e.target.value) || 0 }))}
                      placeholder="Auto-detect"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                {reconstructionProgress.stage === 'completed' ? (
                  <div className="text-white text-center">
                    <Box className="w-16 h-16 mx-auto mb-4 opacity-75" />
                    <p className="text-lg font-medium mb-2">3D Model Preview</p>
                    <p className="text-sm opacity-75">
                      {modelStats.splats.toLocaleString()} Gaussian Splats
                    </p>
                    <p className="text-sm opacity-75">
                      Render time: {modelStats.renderTime}ms
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center">
                    <Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No Model Available</p>
                    <p className="text-sm opacity-75">Complete reconstruction to preview 3D model</p>
                  </div>
                )}
              </div>

              {reconstructionProgress.stage === 'completed' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{modelStats.vertices.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Vertices</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{modelStats.faces.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Faces</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{modelStats.splats.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Splats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{modelStats.renderTime}ms</div>
                    <div className="text-sm text-muted-foreground">Render Time</div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Formats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleExportModel('ply')}
                      disabled={reconstructionProgress.stage !== 'completed'}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PLY (Point Cloud)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleExportModel('obj')}
                      disabled={reconstructionProgress.stage !== 'completed'}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      OBJ (Mesh)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleExportModel('gltf')}
                      disabled={reconstructionProgress.stage !== 'completed'}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      glTF (Web)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleExportModel('splat')}
                      disabled={reconstructionProgress.stage !== 'completed'}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Gaussian Splat
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="exportQuality">Export Quality</Label>
                      <Select defaultValue="high">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ultra">Ultra</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="textureResolution">Texture Resolution</Label>
                      <Select defaultValue="4K">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8K">8K</SelectItem>
                          <SelectItem value="4K">4K</SelectItem>
                          <SelectItem value="2K">2K</SelectItem>
                          <SelectItem value="1080p">1080p</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeTextures">Include Textures</Label>
                      <input type="checkbox" id="includeTextures" defaultChecked className="rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="compress">Compress Output</Label>
                      <input type="checkbox" id="compress" defaultChecked className="rounded" />
                    </div>
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
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Video, Monitor, Settings, Download, Play, Pause, Square, Maximize2, Volume2 } from 'lucide-react'

interface VideoPreviewProps {
  systemStatus: any
}

export function VideoPreview({ systemStatus }: VideoPreviewProps) {
  const [videoSettings, setVideoSettings] = useState({
    inputSource: 'hdmi1',
    resolution: '8K',
    frameRate: '60fps',
    bitrate: 800,
    format: 'H.265',
    monitoring: true,
    audioLevel: 50
  })

  const [recordingStatus, setRecordingStatus] = useState({
    isRecording: false,
    duration: 0,
    fileSize: 0,
    droppedFrames: 0
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (recordingStatus.isRecording) {
      interval = setInterval(() => {
        setRecordingStatus(prev => ({
          ...prev,
          duration: prev.duration + 1,
          fileSize: prev.fileSize + Math.random() * 100,
          droppedFrames: Math.max(0, prev.droppedFrames + (Math.random() > 0.95 ? 1 : 0))
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [recordingStatus.isRecording])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (mb: number) => {
    if (mb < 1024) return `${mb.toFixed(1)} MB`
    return `${(mb / 1024).toFixed(1)} GB`
  }

  const handleStartRecording = () => {
    setRecordingStatus({
      isRecording: true,
      duration: 0,
      fileSize: 0,
      droppedFrames: 0
    })
  }

  const handleStopRecording = () => {
    setRecordingStatus(prev => ({ ...prev, isRecording: false }))
  }

  return (
    <div className="space-y-6">
      {/* Main Video Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <CardTitle>8K Video Preview</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStatus.r5c.connected ? "default" : "destructive"}>
                {systemStatus.r5c.connected ? "Signal Present" : "No Signal"}
              </Badge>
              <Badge variant={recordingStatus.isRecording ? "destructive" : "secondary"}>
                {recordingStatus.isRecording ? "REC" : "LIVE"}
              </Badge>
            </div>
          </div>
          <CardDescription>
            Yuan SC750N1 HDMI 2.1 Capture Card - 8K@60fps Input
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="recording">Recording</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              {/* Video Display */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {systemStatus.r5c.connected ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-75" />
                      <p className="text-lg font-medium mb-2">8K Video Feed</p>
                      <p className="text-sm opacity-75">
                        {videoSettings.resolution} @ {videoSettings.frameRate}
                      </p>
                      {recordingStatus.isRecording && (
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-red-500 font-mono">
                            {formatTime(recordingStatus.duration)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No Signal</p>
                      <p className="text-sm opacity-75">Connect Canon R5C to enable preview</p>
                    </div>
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-2">
                    <Badge variant="secondary" className="text-xs">
                      {videoSettings.resolution}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {videoSettings.frameRate}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {videoSettings.format}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="bg-black/50">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm" className="bg-black/50">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Video Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Input Source</div>
                  <div className="text-lg font-bold">HDMI 2.1</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Capture Card</div>
                  <div className="text-lg font-bold">SC750N1</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Bitrate</div>
                  <div className="text-lg font-bold">{videoSettings.bitrate} Mbps</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Dropped Frames</div>
                  <div className="text-lg font-bold text-red-500">{recordingStatus.droppedFrames}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="inputSource">Input Source</Label>
                    <Select value={videoSettings.inputSource} onValueChange={(value) => setVideoSettings(prev => ({ ...prev, inputSource: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hdmi1">HDMI 1 (Canon R5C)</SelectItem>
                        <SelectItem value="hdmi2">HDMI 2</SelectItem>
                        <SelectItem value="sdi">SDI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="resolution">Input Resolution</Label>
                    <Select value={videoSettings.resolution} onValueChange={(value) => setVideoSettings(prev => ({ ...prev, resolution: value }))}>
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
                    <Select value={videoSettings.frameRate} onValueChange={(value) => setVideoSettings(prev => ({ ...prev, frameRate: value }))}>
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

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="format">Recording Format</Label>
                    <Select value={videoSettings.format} onValueChange={(value) => setVideoSettings(prev => ({ ...prev, format: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="H.265">H.265 (HEVC)</SelectItem>
                        <SelectItem value="H.264">H.264 (AVC)</SelectItem>
                        <SelectItem value="RAW">RAW (Uncompressed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bitrate">Bitrate: {videoSettings.bitrate} Mbps</Label>
                    <Slider
                      value={[videoSettings.bitrate]}
                      onValueChange={(value) => setVideoSettings(prev => ({ ...prev, bitrate: value[0] }))}
                      max={2000}
                      min={100}
                      step={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audioLevel">Audio Level: {videoSettings.audioLevel}%</Label>
                    <Slider
                      value={[videoSettings.audioLevel]}
                      onValueChange={(value) => setVideoSettings(prev => ({ ...prev, audioLevel: value[0] }))}
                      max={100}
                      min={0}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">Clean HDMI Output</div>
                  <div className="text-sm text-muted-foreground">
                    Disable camera overlays for clean capture
                  </div>
                </div>
                <Button variant="outline" disabled={!systemStatus.r5c.connected}>
                  Configure Camera
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="recording" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recording Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Status</div>
                        <div className="text-lg font-bold">
                          {recordingStatus.isRecording ? (
                            <span className="text-red-500">Recording</span>
                          ) : (
                            <span className="text-green-500">Ready</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Duration</div>
                        <div className="text-lg font-bold font-mono">
                          {formatTime(recordingStatus.duration)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">File Size</div>
                        <div className="text-lg font-bold">
                          {formatFileSize(recordingStatus.fileSize)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Dropped Frames</div>
                        <div className="text-lg font-bold text-red-500">
                          {recordingStatus.droppedFrames}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!recordingStatus.isRecording ? (
                        <Button
                          onClick={handleStartRecording}
                          disabled={!systemStatus.r5c.connected}
                          className="flex-1"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button
                          onClick={handleStopRecording}
                          variant="destructive"
                          className="flex-1"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Storage Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Available Space</span>
                        <span>1.2 TB</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Estimated Recording Time</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>8K H.265: ~2.5 hours</div>
                        <div>4K H.264: ~8 hours</div>
                        <div>1080p H.264: ~20 hours</div>
                        <div>RAW: ~45 minutes</div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Manage Recordings
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
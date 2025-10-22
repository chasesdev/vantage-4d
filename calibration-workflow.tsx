"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, AlertTriangle, Settings, Play, Pause, RotateCw, Target, Camera, Zap, Sun } from 'lucide-react'

export function CalibrationWorkflow() {
  const [calibrationStatus, setCalibrationStatus] = useState({
    status: 'idle', // idle, calibrating, completed, error
    progress: 0,
    currentStep: '',
    results: {
      cameras: {
        r5c: { calibrated: false, intrinsics: null, extrinsics: null },
        r5m2: { calibrated: false, intrinsics: null, extrinsics: null }
      },
      gimbal: { calibrated: false, offsets: { pan: 0, tilt: 0, roll: 0 } },
      lighting: { calibrated: false, colorProfile: null },
      synchronization: { calibrated: false, latency: 0, drift: 0 }
    },
    lastCalibration: null
  })

  const [validation, setValidation] = useState(null)

  useEffect(() => {
    // Simulate calibration progress
    let interval: NodeJS.Timeout
    if (calibrationStatus.status === 'calibrating') {
      interval = setInterval(() => {
        setCalibrationStatus(prev => {
          const newProgress = Math.min(100, prev.progress + Math.random() * 5)
          if (newProgress >= 100) {
            return {
              ...prev,
              status: 'completed',
              progress: 100,
              results: {
                cameras: {
                  r5c: { calibrated: true, intrinsics: 'generated', extrinsics: 'generated' },
                  r5m2: { calibrated: true, intrinsics: 'generated', extrinsics: 'generated' }
                },
                gimbal: { calibrated: true, offsets: { pan: 0.1, tilt: -0.05, roll: 0.02 } },
                lighting: { calibrated: true, colorProfile: 'generated' },
                synchronization: { calibrated: true, latency: 8.5, drift: 0.05 }
              },
              lastCalibration: new Date().toISOString()
            }
          }
          return { ...prev, progress: newProgress }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [calibrationStatus.status])

  const handleStartCalibration = async (type: string) => {
    setCalibrationStatus(prev => ({
      ...prev,
      status: 'calibrating',
      progress: 0,
      currentStep: `Starting ${type} calibration...`
    }))

    // Simulate calibration steps
    const steps = getCalibrationSteps(type)
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setCalibrationStatus(prev => ({
        ...prev,
        currentStep: steps[i]
      }))
    }
  }

  const handleStopCalibration = () => {
    setCalibrationStatus(prev => ({
      ...prev,
      status: 'idle',
      progress: 0,
      currentStep: ''
    }))
  }

  const handleResetCalibration = () => {
    setCalibrationStatus({
      status: 'idle',
      progress: 0,
      currentStep: '',
      results: {
        cameras: {
          r5c: { calibrated: false, intrinsics: null, extrinsics: null },
          r5m2: { calibrated: false, intrinsics: null, extrinsics: null }
        },
        gimbal: { calibrated: false, offsets: { pan: 0, tilt: 0, roll: 0 } },
        lighting: { calibrated: false, colorProfile: null },
        synchronization: { calibrated: false, latency: 0, drift: 0 }
      },
      lastCalibration: null
    })
  }

  const handleValidateCalibration = async () => {
    // Simulate validation
    const mockValidation = {
      overall: 'good',
      cameras: {
        r5c: calibrationStatus.results.cameras.r5c.calibrated ? 'calibrated' : 'not_calibrated',
        r5m2: calibrationStatus.results.cameras.r5m2.calibrated ? 'calibrated' : 'not_calibrated'
      },
      gimbal: calibrationStatus.results.gimbal.calibrated ? 'calibrated' : 'not_calibrated',
      lighting: calibrationStatus.results.lighting.calibrated ? 'calibrated' : 'not_calibrated',
      synchronization: calibrationStatus.results.synchronization.calibrated ? 'calibrated' : 'not_calibrated',
      recommendations: []
    }

    if (!calibrationStatus.results.cameras.r5c.calibrated) {
      mockValidation.recommendations.push('Calibrate Canon R5C camera')
    }
    if (!calibrationStatus.results.gimbal.calibrated) {
      mockValidation.recommendations.push('Calibrate DJI Ronin gimbal')
    }

    setValidation(mockValidation)
  }

  const getCalibrationSteps = (type: string) => {
    const steps = {
      cameras: [
        'Detecting checkerboard pattern...',
        'Capturing calibration images...',
        'Computing intrinsics...',
        'Computing extrinsics...',
        'Optimizing parameters...'
      ],
      gimbal: [
        'Finding home position...',
        'Testing pan axis...',
        'Testing tilt axis...',
        'Testing roll axis...',
        'Computing offsets...'
      ],
      lighting: [
        'Measuring ambient light...',
        'Testing key light...',
        'Testing fill light...',
        'Testing back light...',
        'Creating color profile...'
      ],
      synchronization: [
        'Testing camera sync...',
        'Measuring latency...',
        'Testing trigger signals...',
        'Optimizing timing...'
      ],
      full: [
        'Calibrating cameras...',
        'Calibrating gimbal...',
        'Calibrating lighting...',
        'Calibrating synchronization...',
        'Final validation...'
      ]
    }
    return steps[type as keyof typeof steps] || []
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calibrated': return 'default'
      case 'not_calibrated': return 'destructive'
      case 'calibrating': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Calibration Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <CardTitle>System Calibration</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={
                calibrationStatus.status === 'completed' ? 'default' :
                calibrationStatus.status === 'calibrating' ? 'secondary' :
                calibrationStatus.status === 'error' ? 'destructive' : 'secondary'
              }>
                {calibrationStatus.status === 'completed' ? 'Calibrated' :
                 calibrationStatus.status === 'calibrating' ? 'Calibrating' :
                 calibrationStatus.status === 'error' ? 'Error' : 'Not Calibrated'}
              </Badge>
              {calibrationStatus.lastCalibration && (
                <span className="text-sm text-muted-foreground">
                  Last: {new Date(calibrationStatus.lastCalibration).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <CardDescription>
            Calibrate all system components for optimal performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Calibration Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Camera className="w-5 h-5" />
                      <Badge variant={getStatusColor(calibrationStatus.results.cameras.r5c.calibrated ? 'calibrated' : 'not_calibrated')}>
                        {calibrationStatus.results.cameras.r5c.calibrated ? 'Calibrated' : 'Not Calibrated'}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">Cameras</div>
                    <div className="text-xs text-muted-foreground">
                      R5C & R5 Mk II
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <RotateCw className="w-5 h-5" />
                      <Badge variant={getStatusColor(calibrationStatus.results.gimbal.calibrated ? 'calibrated' : 'not_calibrated')}>
                        {calibrationStatus.results.gimbal.calibrated ? 'Calibrated' : 'Not Calibrated'}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">Gimbal</div>
                    <div className="text-xs text-muted-foreground">
                      DJI Ronin
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Sun className="w-5 h-5" />
                      <Badge variant={getStatusColor(calibrationStatus.results.lighting.calibrated ? 'calibrated' : 'not_calibrated')}>
                        {calibrationStatus.results.lighting.calibrated ? 'Calibrated' : 'Not Calibrated'}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">Lighting</div>
                    <div className="text-xs text-muted-foreground">
                      DMX System
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5" />
                      <Badge variant={getStatusColor(calibrationStatus.results.synchronization.calibrated ? 'calibrated' : 'not_calibrated')}>
                        {calibrationStatus.results.synchronization.calibrated ? 'Calibrated' : 'Not Calibrated'}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">Sync</div>
                    <div className="text-xs text-muted-foreground">
                      System Timing
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleStartCalibration('full')}
                  disabled={calibrationStatus.status === 'calibrating'}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Full System Calibration
                </Button>
                <Button
                  variant="outline"
                  onClick={handleValidateCalibration}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Validate Calibration
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetCalibration}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </div>

              {/* Calibration Progress */}
              {calibrationStatus.status === 'calibrating' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Calibration Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{calibrationStatus.currentStep}</span>
                        <span>{Math.round(calibrationStatus.progress)}%</span>
                      </div>
                      <Progress value={calibrationStatus.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Camera Calibration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Canon R5C</span>
                        <Badge variant={getStatusColor(calibrationStatus.results.cameras.r5c.calibrated ? 'calibrated' : 'not_calibrated')}>
                          {calibrationStatus.results.cameras.r5c.calibrated ? 'Calibrated' : 'Not Calibrated'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Canon R5 Mk II</span>
                        <Badge variant={getStatusColor(calibrationStatus.results.cameras.r5m2.calibrated ? 'calibrated' : 'not_calibrated')}>
                          {calibrationStatus.results.cameras.r5m2.calibrated ? 'Calibrated' : 'Not Calibrated'}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStartCalibration('cameras')}
                      disabled={calibrationStatus.status === 'calibrating'}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Calibrate Cameras
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      Requires checkerboard pattern and multiple angles
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gimbal Calibration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status</span>
                        <Badge variant={getStatusColor(calibrationStatus.results.gimbal.calibrated ? 'calibrated' : 'not_calibrated')}>
                          {calibrationStatus.results.gimbal.calibrated ? 'Calibrated' : 'Not Calibrated'}
                        </Badge>
                      </div>
                      {calibrationStatus.results.gimbal.calibrated && (
                        <div className="text-xs text-muted-foreground">
                          Offsets: Pan {calibrationStatus.results.gimbal.offsets.pan}°, 
                          Tilt {calibrationStatus.results.gimbal.offsets.tilt}°, 
                          Roll {calibrationStatus.results.gimbal.offsets.roll}°
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleStartCalibration('gimbal')}
                      disabled={calibrationStatus.status === 'calibrating'}
                      className="w-full"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Calibrate Gimbal
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      Ensures accurate positioning and movement
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lighting Calibration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status</span>
                        <Badge variant={getStatusColor(calibrationStatus.results.lighting.calibrated ? 'calibrated' : 'not_calibrated')}>
                          {calibrationStatus.results.lighting.calibrated ? 'Calibrated' : 'Not Calibrated'}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStartCalibration('lighting')}
                      disabled={calibrationStatus.status === 'calibrating'}
                      className="w-full"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Calibrate Lighting
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      Creates color profile and white balance settings
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Synchronization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status</span>
                        <Badge variant={getStatusColor(calibrationStatus.results.synchronization.calibrated ? 'calibrated' : 'not_calibrated')}>
                          {calibrationStatus.results.synchronization.calibrated ? 'Calibrated' : 'Not Calibrated'}
                        </Badge>
                      </div>
                      {calibrationStatus.results.synchronization.calibrated && (
                        <div className="text-xs text-muted-foreground">
                          Latency: {calibrationStatus.results.synchronization.latency}ms, 
                          Drift: {calibrationStatus.results.synchronization.drift}ms
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleStartCalibration('synchronization')}
                      disabled={calibrationStatus.status === 'calibrating'}
                      className="w-full"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Calibrate Sync
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      Optimizes timing between all components
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Calibration Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Pre-Calibration Checklist</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>All devices connected</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Checkerboard pattern ready</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Lighting conditions optimal</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Clear workspace</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Calibration Steps</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <span>Camera calibration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <span>Gimbal calibration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <span>Lighting calibration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <span>Synchronization calibration</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {calibrationStatus.status === 'calibrating' && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-5 h-5 text-blue-500" />
                          <span className="font-medium text-blue-700 dark:text-blue-300">
                            Calibration in Progress
                          </span>
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {calibrationStatus.currentStep}
                        </p>
                        <Progress value={calibrationStatus.progress} className="mt-2" />
                      </div>
                    )}

                    {calibrationStatus.status === 'completed' && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            Calibration Completed Successfully
                          </span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          All system components have been calibrated and are ready for use.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validation" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Calibration Validation</CardTitle>
                    <Button
                      onClick={handleValidateCalibration}
                      disabled={calibrationStatus.status === 'calibrating'}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Run Validation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {validation ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Component Status</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Canon R5C:</span>
                              <Badge variant={getStatusColor(validation.cameras.r5c)}>
                                {validation.cameras.r5c}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Canon R5 Mk II:</span>
                              <Badge variant={getStatusColor(validation.cameras.r5m2)}>
                                {validation.cameras.r5m2}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Gimbal:</span>
                              <Badge variant={getStatusColor(validation.gimbal)}>
                                {validation.gimbal}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Lighting:</span>
                              <Badge variant={getStatusColor(validation.lighting)}>
                                {validation.lighting}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Synchronization:</span>
                              <Badge variant={getStatusColor(validation.synchronization)}>
                                {validation.synchronization}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Overall Status</h4>
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                              {validation.overall === 'good' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                              )}
                              <span className="font-medium capitalize">{validation.overall}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {validation.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <div className="space-y-1">
                            {validation.recommendations.map((rec, index) => (
                              <Alert key={index}>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{rec}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">No Validation Data</p>
                      <p className="text-sm text-muted-foreground">
                        Click "Run Validation" to check calibration status
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
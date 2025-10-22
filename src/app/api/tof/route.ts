import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// ToF camera system status
let tofStatus = {
  connected: false,
  cameras: [
    { id: 1, name: 'Front ToF', position: { x: 0, y: 0, z: 0 }, detecting: false, people: 0 },
    { id: 2, name: 'Side ToF', position: { x: 1, y: 0, z: 0 }, detecting: false, people: 0 }
  ],
  monitoring: {
    active: false,
    sensitivity: 0.7,
    alertDistance: 0.5, // meters
    maxDepth: 5.0 // meters
  },
  alerts: [],
  depthMap: null
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: tofStatus
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get ToF status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, settings } = await request.json()

    switch (action) {
      case 'connect':
        // Connect to Luxonis ToF cameras
        tofStatus.connected = true
        console.log('Connecting to Luxonis ToF cameras...')
        
        // Initialize cameras
        tofStatus.cameras.forEach(camera => {
          camera.detecting = true
        })
        break

      case 'disconnect':
        tofStatus.connected = false
        tofStatus.monitoring.active = false
        tofStatus.cameras.forEach(camera => {
          camera.detecting = false
          camera.people = 0
        })
        console.log('Disconnecting ToF cameras...')
        break

      case 'start_monitoring':
        if (tofStatus.connected) {
          tofStatus.monitoring.active = true
          console.log('Starting patient safety monitoring...')
          
          // Start monitoring loop
          startMonitoringLoop()
        }
        break

      case 'stop_monitoring':
        tofStatus.monitoring.active = false
        console.log('Stopping patient monitoring...')
        break

      case 'update_settings':
        if (settings) {
          tofStatus.monitoring = { ...tofStatus.monitoring, ...settings }
          console.log('Updated ToF monitoring settings:', settings)
        }
        break

      case 'get_depth_map':
        if (tofStatus.connected) {
          const depthMap = await captureDepthMap()
          tofStatus.depthMap = depthMap
        }
        break

      case 'clear_alerts':
        tofStatus.alerts = []
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return NextResponse.json({
      success: true,
      data: tofStatus
    })

  } catch (error) {
    console.error('ToF control error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Monitoring loop for patient safety
async function startMonitoringLoop() {
  while (tofStatus.monitoring.active) {
    try {
      // Simulate depth sensing and people detection
      for (const camera of tofStatus.cameras) {
        if (camera.detecting) {
          // Simulate random people detection
          const detectedPeople = Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0
          camera.people = detectedPeople

          // Generate alerts if people are too close
          if (detectedPeople > 0) {
            const distance = Math.random() * 2 // Simulate distance
            if (distance < tofStatus.monitoring.alertDistance) {
              const alert = {
                id: Date.now(),
                type: 'warning',
                camera: camera.name,
                message: `Person detected at ${distance.toFixed(2)}m - ${camera.name}`,
                distance: distance,
                timestamp: new Date().toISOString()
              }
              tofStatus.alerts.push(alert)
              
              // Keep only last 10 alerts
              if (tofStatus.alerts.length > 10) {
                tofStatus.alerts.shift()
              }
            }
          }
        }
      }

      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Monitoring loop error:', error)
      break
    }
  }
}

// Capture depth map from ToF cameras
async function captureDepthMap() {
  try {
    const zai = await ZAI.create()
    
    // Use AI to generate realistic depth map data
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a computer vision expert. Generate realistic depth map data for a ToF camera monitoring system.'
        },
        {
          role: 'user',
          content: 'Generate depth map data for a 640x480 ToF camera with 5m maximum range, including depth values and confidence scores.'
        }
      ]
    })

    // Simulate depth map generation
    const width = 640
    const height = 480
    const depthData = []
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Generate realistic depth values
        const depth = Math.random() * tofStatus.monitoring.maxDepth
        const confidence = Math.random() * 0.3 + 0.7 // 70-100% confidence
        depthData.push({ x, y, depth, confidence })
      }
    }

    return {
      width,
      height,
      data: depthData,
      timestamp: new Date().toISOString(),
      maxDepth: tofStatus.monitoring.maxDepth
    }

  } catch (error) {
    console.error('Depth map capture error:', error)
    return null
  }
}

// Get real-time people detection
export async function GET_DETECTION(request: NextRequest) {
  try {
    const detections = tofStatus.cameras.map(camera => ({
      cameraId: camera.id,
      cameraName: camera.name,
      peopleCount: camera.people,
      detecting: camera.detecting,
      lastUpdate: new Date().toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: detections
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get detection data' },
      { status: 500 }
    )
  }
}
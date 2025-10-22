import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// DMX lighting system status
let lightingStatus = {
  connected: false,
  universe: 1,
  lights: [
    { id: 1, name: 'Key Light', intensity: 75, color: '#FFFFFF', temperature: 5600, enabled: true },
    { id: 2, name: 'Fill Light', intensity: 50, color: '#FFFFFF', temperature: 5600, enabled: true },
    { id: 3, name: 'Back Light', intensity: 30, color: '#FFFFFF', temperature: 3200, enabled: true },
    { id: 4, name: 'Top Light', intensity: 40, color: '#FFFFFF', temperature: 5600, enabled: false }
  ],
  activeScene: 'neutral',
  settings: {
    refreshRate: 40,
    transitionTime: 1000
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: lightingStatus
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get lighting status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, settings, sceneId, lightId } = await request.json()

    switch (action) {
      case 'connect':
        // Connect to DMX lighting system
        lightingStatus.connected = true
        console.log('Connecting to Godox DMX lighting system...')
        break

      case 'disconnect':
        lightingStatus.connected = false
        // Turn off all lights
        lightingStatus.lights.forEach(light => {
          light.intensity = 0
          light.enabled = false
        })
        console.log('Disconnecting DMX lighting system...')
        break

      case 'set_scene':
        if (lightingStatus.connected && sceneId) {
          lightingStatus.activeScene = sceneId
          await applyLightingScene(sceneId)
        }
        break

      case 'update_light':
        if (lightingStatus.connected && lightId && settings) {
          const light = lightingStatus.lights.find(l => l.id === lightId)
          if (light) {
            Object.assign(light, settings)
            console.log(`Updated ${light.name}:`, settings)
            
            // Send DMX signal
            await sendDMXSignal(light)
          }
        }
        break

      case 'toggle_all':
        if (lightingStatus.connected) {
          const enabled = settings.enabled
          lightingStatus.lights.forEach(light => {
            light.enabled = enabled
            if (!enabled) light.intensity = 0
          })
          console.log(`${enabled ? 'Enabled' : 'Disabled'} all lights`)
        }
        break

      case 'save_scene':
        if (lightingStatus.connected && settings.sceneName) {
          const newScene = {
            id: `custom_${Date.now()}`,
            name: settings.sceneName,
            lights: JSON.parse(JSON.stringify(lightingStatus.lights))
          }
          console.log('Saved custom scene:', newScene)
        }
        break

      case 'start_sequence':
        if (lightingStatus.connected && settings.sequenceType) {
          console.log(`Starting lighting sequence: ${settings.sequenceType}`)
          await executeLightingSequence(settings.sequenceType)
        }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return NextResponse.json({
      success: true,
      data: lightingStatus
    })

  } catch (error) {
    console.error('Lighting control error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Apply predefined lighting scenes
async function applyLightingScene(sceneId: string) {
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
    for (const presetLight of preset) {
      const light = lightingStatus.lights.find(l => l.id === presetLight.id)
      if (light) {
        light.intensity = presetLight.intensity
        light.temperature = presetLight.temperature
        light.enabled = light.intensity > 0
        await sendDMXSignal(light)
      }
    }
  }
}

// Send DMX signal to individual light
async function sendDMXSignal(light: any) {
  // Simulate DMX signal transmission
  const dmxChannel = light.id * 3 // 3 channels per light (intensity, color temp, etc.)
  console.log(`Sending DMX signal to channel ${dmxChannel}:`, {
    intensity: light.intensity,
    temperature: light.temperature,
    color: light.color
  })
  
  // Add small delay to simulate DMX transmission
  await new Promise(resolve => setTimeout(resolve, 50))
}

// Execute automated lighting sequences
async function executeLightingSequence(sequenceType: string) {
  switch (sequenceType) {
    case 'capture':
      // Optimize lighting for capture sequence
      await applyLightingScene('macro')
      break
    case 'daylight':
      // Simulate daylight changes
      for (let i = 0; i < 10; i++) {
        const brightness = 50 + Math.sin(i * 0.5) * 30
        lightingStatus.lights.forEach(light => {
          if (light.enabled) {
            light.intensity = brightness
          }
        })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      break
    case 'color_cycle':
      // Cycle through different color temperatures
      const temperatures = [2700, 3200, 4000, 5600, 6500]
      for (const temp of temperatures) {
        lightingStatus.lights.forEach(light => {
          if (light.enabled) {
            light.temperature = temp
          }
        })
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      break
  }
}
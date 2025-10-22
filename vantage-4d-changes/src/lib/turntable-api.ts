/**
 * Turntable API Configuration
 * 
 * This file contains configuration and types for the ComXim TurnTablePlus API integration.
 * Update the TURNTABLE_CONFIG with your actual turntable IP address and settings.
 */

// Turntable Configuration
export const TURNTABLE_CONFIG = {
  // Update this with your actual turntable IP address
  baseUrl: process.env.TURNTABLE_API_URL || 'http://192.168.1.100:8080',
  
  // API endpoints
  endpoints: {
    init: '/api/init',
    move: '/api/move',
    rotate: '/api/rotate',
    stop: '/api/stop',
    position: '/api/position',
    status: '/api/status'
  },
  
  // Default settings
  defaults: {
    speed: 10, // RPM
    acceleration: 1000, // ms
    deceleration: 1000, // ms
    maxSpeed: 60, // RPM
    minSpeed: 1 // RPM
  },
  
  // Timeouts
  timeout: {
    connection: 5000, // ms
    command: 10000 // ms
  }
}

// TypeScript Types
export interface TurntableInitRequest {
  speed?: number
  acceleration?: number
  deceleration?: number
}

export interface TurntableMoveRequest {
  angle: number
  speed?: number
  direction?: 'cw' | 'ccw'
}

export interface TurntableRotateRequest {
  direction: 'cw' | 'ccw'
  speed?: number
}

export interface TurntablePosition {
  currentAngle: number
  isMoving: boolean
  speed: number
  direction: 'cw' | 'ccw'
  timestamp: string
}

export interface TurntableStatus {
  connected: boolean
  isMoving: boolean
  currentAngle: number
  speed: number
  direction: 'cw' | 'ccw'
  error?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Helper function to make API calls to the actual turntable hardware
export async function callTurntableAPI<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const url = `${TURNTABLE_CONFIG.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TURNTABLE_CONFIG.timeout.command)
    })

    if (!response.ok) {
      throw new Error(`Turntable API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Turntable API call failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Validation helpers
export function validateSpeed(speed: number): boolean {
  return speed >= TURNTABLE_CONFIG.defaults.minSpeed && 
         speed <= TURNTABLE_CONFIG.defaults.maxSpeed
}

export function validateAngle(angle: number): boolean {
  return angle >= 0 && angle <= 360
}

export function validateDirection(direction: string): direction is 'cw' | 'ccw' {
  return direction === 'cw' || direction === 'ccw'
}

# Vantage4D Control System

A professional 4D capture and control system for photogrammetry and 3D scanning applications, integrating Canon R5C, R5 Mk II cameras, gimbal control, and ComXim TurnTablePlus rotating platform.

## 🎯 Overview

Vantage4D is an integrated control system designed for professional 4D capture workflows, combining:

- **8K Video Capture** via Canon R5C
- **High-Resolution Photography** via Canon R5 Mk II
- **Precision Gimbal Control** for camera movement
- **Rotating Platform Control** via ComXim TurnTablePlus
- **Real-time System Monitoring** and status tracking
- **3D Reconstruction Pipeline** integration

## ✨ Features

### 📷 Camera Control
- **Canon R5C Integration**: 8K video recording with full parameter control
- **Canon R5 Mk II Integration**: High-resolution photo capture with focus stacking
- **Real-time Preview**: Live video feed monitoring
- **Capture Sequences**: Automated multi-frame capture workflows

### 🔄 Gimbal Control
- **Precision Movement**: Smooth camera positioning and rotation
- **Battery Monitoring**: Real-time power level tracking
- **Mode Control**: Idle, tracking, and programmed movement modes

### 🎯 Turntable Integration
- **ComXim TurnTablePlus API**: Full integration with rotating platform
- **360° Capture**: Automated rotation for complete object scanning
- **Position Control**: Precise angle positioning (0-360°)
- **Speed Control**: Adjustable rotation speed (1-30 RPM)
- **Preset Positions**: Quick access to common angles
- **Direction Control**: Clockwise and counter-clockwise rotation

### 📊 System Monitoring
- **Device Status**: Real-time connection monitoring
- **Capture Progress**: Frame counting and progress tracking
- **Storage Management**: Available space monitoring
- **System Alerts**: Warning and notification system

### 🎨 User Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Real-time Updates**: Live status and progress indicators
- **Intuitive Controls**: Professional control panel layout
- **Dark/Light Mode**: Theme switching support

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library
- **Lucide React** icons

### Backend & Integration
- **REST API** for device communication
- **WebSocket** for real-time updates
- **Prisma ORM** for data management
- **Next.js API Routes** for backend logic

### Hardware Integration
- **Canon EOS SDK** for camera control
- **ComXim TurnTablePlus API** for turntable control
- **Gimbal Controller API** for movement control

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Canon R5C and/or R5 Mk II cameras
- ComXim TurnTablePlus (optional)
- Compatible gimbal system
- Network connection for device communication

### Installation

```bash
# Clone the repository
git clone https://github.com/chasesdev/vantage-4d.git
cd vantage-4d

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Configuration

1. **Camera Setup**
   - Connect Canon cameras via USB or network
   - Install Canon EOS utilities
   - Configure camera settings in the control panel

2. **Turntable Setup**
   - Connect ComXim TurnTablePlus to network
   - Configure API endpoint (default: `http://192.168.1.100:8080`)
   - Test connection in Turntable Control panel

3. **Gimbal Setup**
   - Connect gimbal controller
   - Configure communication parameters
   - Calibrate movement limits

## 📖 Usage Guide

### Camera Control

1. **Video Capture (R5C)**
   - Navigate to **Cameras** tab
   - Select R5C camera
   - Configure resolution (8K, 4K, 1080p)
   - Set frame rate (24, 30, 60 fps)
   - Click **Start Recording**

2. **Photo Capture (R5 Mk II)**
   - Navigate to **Cameras** tab
   - Select R5 Mk II camera
   - Configure focus stacking settings
   - Set capture intervals
   - Click **Start Capture**

### Turntable Control

1. **Manual Control**
   - Navigate to **Turntable** tab
   - Connect to turntable via API
   - Use position slider to set target angle
   - Click **Move to Position**

2. **Continuous Rotation**
   - Set rotation speed (1-30 RPM)
   - Choose direction (CW/CCW)
   - Click **Start** for continuous rotation
   - Use **Stop** to halt movement

3. **Preset Positions**
   - Navigate to **Preset Positions** tab
   - Click preset angle buttons (0°, 45°, 90°, etc.)
   - Enable **Auto Rotate** for automated sequences

### System Monitoring

- **Status Bar**: View connection status for all devices
- **Capture Progress**: Monitor active capture sessions
- **Alerts Panel**: View system warnings and notifications
- **Storage Monitor**: Check available disk space

## 🔧 API Integration

### Turntable API Endpoints

The system integrates with the ComXim TurnTablePlus API:

```javascript
// Initialize turntable
POST /api/turntable/init
{
  "speed": 10,
  "acceleration": 1000,
  "deceleration": 1000
}

// Move to specific angle
POST /api/turntable/move
{
  "angle": 90,
  "speed": 10,
  "direction": "cw"
}

// Start continuous rotation
POST /api/turntable/rotate
{
  "direction": "cw",
  "speed": 15
}

// Stop all movement
POST /api/turntable/stop

// Get current position
GET /api/turntable/position
```

### Camera Control API

```javascript
// Start video recording
POST /api/camera/video/start
{
  "camera": "r5c",
  "resolution": "8K",
  "frameRate": 30
}

// Stop video recording
POST /api/camera/video/stop

// Capture photo
POST /api/camera/photo/capture
{
  "camera": "r5m2",
  "focusStack": true,
  "frames": 5
}
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── camera-control-panel.tsx
│   ├── gimbal-control.tsx
│   ├── turntable-control.tsx
│   ├── video-preview.tsx
│   ├── reconstruction-3d.tsx
│   ├── lighting-control.tsx
│   ├── system-status.tsx
│   ├── tof-monitoring.tsx
│   └── calibration-workflow.tsx
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and configurations
└── styles/                  # Additional styles
```

## 🐛 Troubleshooting

### Common Issues

1. **Camera Connection Failed**
   - Check USB/network connections
   - Ensure Canon EOS utilities are installed
   - Restart camera and control software

2. **Turntable Not Responding**
   - Verify network connection to turntable
   - Check API endpoint URL
   - Ensure turntable is powered on

3. **Gimbal Control Issues**
   - Check controller connections
   - Verify power supply
   - Recalibrate movement limits

4. **Performance Issues**
   - Close unnecessary applications
   - Check available storage space
   - Verify network bandwidth

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=vantage4d:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Canon** for EOS SDK and camera integration
- **ComXim** for TurnTablePlus API documentation
- **shadcn/ui** for beautiful UI components
- **Next.js** team for the excellent framework

## 📞 Support

For support and questions:

- Open an issue on GitHub
- Check the [Wiki](https://github.com/chasesdev/vantage-4d/wiki) for documentation
- Review the [API Documentation](./docs/api.md)

---

Built with ❤️ for the photogrammetry and 3D scanning community.

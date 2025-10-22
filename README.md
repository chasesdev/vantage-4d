"# Vantage4D Control System

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
git clone https://github.com/chasesdev/vantage-4d.git
cd vantage-4d
npm install
npm run dev
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
1. Create a feature branch (`git checkout -b feature/amazing-feature`)
1. Commit your changes (`git commit -m 'Add amazing feature'`)
1. Push to the branch (`git push origin feature/amazing-feature`)
1. Open a Pull Request

## 📄 License

MIT License"
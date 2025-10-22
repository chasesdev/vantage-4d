# Vantage4D Turntable Integration - Implementation Guide

## 📋 Overview

This package contains all the changes needed to add ComXim TurnTablePlus integration to your Vantage4D project.

## 📦 Files Included

### Frontend Components
1. **src/components/turntable-control.tsx** (NEW FILE)
   - Complete turntable control component
   - Manual control, preset positions, and settings tabs
   - API integration with ComXim TurnTablePlus

2. **src/app/page.tsx** (MODIFIED)
   - Added turntable status to systemStatus state
   - Added Move3D icon import
   - Added turntable tab to main navigation
   - Added turntable status card to device overview
   - Integrated TurntableControl component

### API Routes (NEW FILES)
3. **src/app/api/turntable/init/route.ts**
   - Initialize turntable connection
   - Configure speed and acceleration parameters

4. **src/app/api/turntable/move/route.ts**
   - Move turntable to specific angle
   - Validate angle (0-360°) and speed parameters

5. **src/app/api/turntable/rotate/route.ts**
   - Start continuous rotation
   - Control direction and speed

6. **src/app/api/turntable/stop/route.ts**
   - Stop all turntable movement
   - Emergency stop endpoint

7. **src/app/api/turntable/position/route.ts**
   - Get current turntable position
   - Query turntable status

### Configuration Files (NEW FILES)
8. **src/lib/turntable-api.ts**
   - API configuration and helper functions
   - TypeScript types and interfaces
   - Validation utilities

9. **.env.example**
   - Environment variable template
   - API endpoint configuration

### Documentation (UPDATED)
10. **README.md**
   - Comprehensive documentation
   - Turntable integration section
   - API documentation
   - Usage guide

## 🚀 Implementation Steps

### Step 1: Backup Your Current Files
```bash
# Create a backup of files that will be modified
cp src/app/page.tsx src/app/page.tsx.backup
cp README.md README.md.backup
```

### Step 2: Add New Component
```bash
# Copy the new turntable control component
cp src/components/turntable-control.tsx /path/to/your/vantage-4d/src/components/
```

### Step 3: Update page.tsx

**Option A: Replace Entire File**
```bash
# Replace the entire page.tsx with the updated version
cp src/app/page.tsx /path/to/your/vantage-4d/src/app/
```

**Option B: Manual Changes** (if you have custom modifications)

Make these specific changes to your existing `src/app/page.tsx`:

1. **Line 10** - Add Move3D import:
```typescript
import { Camera, Video, Settings, Activity, Zap, Monitor, Play, Square, RotateCcw, Move3D } from 'lucide-react'
```

2. **Lines 18-19** - Add TurntableControl import:
```typescript
import { CalibrationWorkflow } from '@/components/calibration-workflow'
import { TurntableControl } from '@/components/turntable-control'
```

3. **Lines 22-29** - Update systemStatus state:
```typescript
const [systemStatus, setSystemStatus] = useState({
  r5c: { connected: false, recording: false, mode: 'standby' },
  r5m2: { connected: false, capturing: false, focusStack: 0 },
  gimbal: { connected: false, mode: 'idle', battery: 100 },
  turntable: { connected: false, moving: false, angle: 0 }, // NEW LINE
  capture: { active: false, progress: 0, frames: 0 },
  reconstruction: { status: 'idle', progress: 0 }
})
```

4. **Line 128** - Change grid columns:
```typescript
<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
```

5. **After gimbal status card (around line 167)** - Add turntable status card:
```typescript
<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
  <div className="flex items-center gap-2">
    <Move3D className="w-4 h-4" />
    <span className="font-medium">Turntable</span>
  </div>
  <Badge variant={systemStatus.turntable?.connected ? "default" : "destructive"}>
    {systemStatus.turntable?.connected ? "Connected" : "Disconnected"}
  </Badge>
</div>
```

6. **Line 204** - Update TabsList grid columns:
```typescript
<TabsList className="grid w-full grid-cols-9">
```

7. **After TabsTrigger gimbal** - Add turntable tab:
```typescript
<TabsTrigger value="turntable">Turntable</TabsTrigger>
```

8. **After TabsContent gimbal** - Add turntable content:
```typescript
<TabsContent value="turntable">
  <TurntableControl systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
</TabsContent>
```

### Step 4: Update README.md
```bash
# Replace README with updated documentation
cp README.md /path/to/your/vantage-4d/
```

### Step 5: Test the Changes
```bash
cd /path/to/your/vantage-4d
npm run dev
```

Visit http://localhost:3000 and:
1. Check that the new "Turntable" tab appears
2. Click on the Turntable tab
3. Test the connection toggle
4. Test manual controls
5. Verify preset positions work
6. Check settings tab

## 🔧 Configuration

### Turntable API Endpoint

The default API endpoint is set to: `http://192.168.1.100:8080`

To change this:
1. Navigate to Turntable tab
2. Click Settings sub-tab
3. Update the API Endpoint field
4. Click Connect

### API Requirements

The component expects the following API endpoints:

- `POST /api/turntable/init` - Initialize turntable
- `POST /api/turntable/move` - Move to specific angle
- `POST /api/turntable/rotate` - Start continuous rotation
- `POST /api/turntable/stop` - Stop all movement
- `GET /api/turntable/position` - Get current position

## 🎯 Features Added

### Manual Control Tab
- Current position display with progress bar
- Target angle slider (0-360°)
- Move to position button
- Speed control (1-30 RPM)
- Direction toggle (CW/CCW)
- Start/Pause/Stop buttons

### Preset Positions Tab
- Quick angle buttons (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
- Auto rotate toggle
- Rotation pattern selection

### Settings Tab
- API endpoint configuration
- Max speed settings
- Acceleration settings
- Capture mode integration toggle
- Reset position button

### Status Display
- Real-time position tracking
- Speed indicator
- Direction indicator
- Movement status badge

## 🐛 Troubleshooting

### Component Not Showing
- Verify file paths are correct
- Check import statements
- Ensure all shadcn/ui components are installed
- Run `npm install` to update dependencies

### TypeScript Errors
- Verify TypeScript version is compatible
- Check that all type definitions are correct
- Run `npm run type-check` to identify issues

### Turntable Not Connecting
- Verify turntable is powered on
- Check network connectivity
- Confirm API endpoint URL is correct
- Test API endpoints with curl or Postman

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Verify shadcn/ui theme is installed
- Check for conflicting CSS classes

## 📝 Git Workflow

### Create Branch
```bash
git checkout -b feature/turntable-integration
```

### Stage Changes
```bash
git add src/components/turntable-control.tsx
git add src/app/page.tsx
git add README.md
```

### Commit
```bash
git commit -m "feat: Add ComXim TurnTablePlus turntable integration

- Add comprehensive turntable control component
- Integrate turntable status into main dashboard
- Add manual control, presets, and settings
- Update documentation with turntable guide
- Add API integration for ComXim TurnTablePlus"
```

### Push and Create PR
```bash
git push origin feature/turntable-integration
```

Then create a Pull Request on GitHub.

## 📚 Additional Resources

- [ComXim TurnTablePlus Documentation](https://www.comxim.com/turntableplus)
- [Vantage4D GitHub Repository](https://github.com/chasesdev/vantage-4d)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## ✅ Checklist

- [ ] Backed up original files
- [ ] Added turntable-control.tsx component
- [ ] Updated page.tsx with all changes
- [ ] Updated README.md
- [ ] Tested local development build
- [ ] Verified turntable tab appears
- [ ] Tested connection functionality
- [ ] Tested manual controls
- [ ] Tested preset positions
- [ ] Checked settings configuration
- [ ] Verified TypeScript compiles
- [ ] Created Git branch
- [ ] Committed changes
- [ ] Pushed to GitHub
- [ ] Created Pull Request

## 🎉 Success!

Once all changes are implemented and tested, you'll have a fully integrated turntable control system in your Vantage4D platform!

For questions or issues, please open an issue on GitHub or refer to the documentation.

---

**Version**: 1.0.0
**Date**: October 2025
**Author**: Vantage4D Development Team

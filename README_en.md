# React Native Game Dual Joysticks Demo

This project is in the **[RN-Game-Joystick](https://github.com/adamthewebguy/RN-Game-Joystick)** project based on a simple modification,
The original project was one joystick controlling one small ball. Based on this, I achieved two joysticks controlling two small balls. The joysticks do not affect each other and can be controlled simultaneously.
It can be used in scenarios with dual joystick control, such as game, drone and racing car remote control. 

The following is the APP effect (If the gif image stops, just refresh the web page):

<div align="center">
    <img src="assets/display.gif" width="30%" alt="display animation">
</div>

### How is the simultaneous control of two joysticks achieved

By default, **React Native GestureHandler(RNGH)** only allows one gesture to be active within the same **GestureHandlerRootView**, even if their regions do not overlap.

To support multiple simultaneously activated gestures (such as dual joysticks, multi-finger drawing), each independent gesture component should be wrapped in its own **GestureHandlerRootView**.

The key to achieving dual joysticks is that each Joystick must use an independent **GestureHandlerRootView** (view **app\index.tsx**).

<div align="center">
    <img src="assets/double_joysticks.png" width="50%" alt="display animation">
</div>

The following document content is basically the original project documents translation content, only have modified on some description, details refer to the original project --> **[RN-Game-Joystick](https://github.com/adamthewebguy/RN-Game-Joystick)**

A minimal, performant dual joysticks controller implementation for React Native games, built with Expo, React Native Reanimated v4, and Gesture Handler.

## Features

- 🎮 Virtual dual joysticks with smooth gesture handling
- ⚡ 60fps performance using frame-based animation on UI thread
- 🎯 Boundary-constrained character movement
- 📱  Works on iOS, Android, and Web
- 🔧 TypeScript support with full type definitions
- 📚 Comprehensive component documentation

## Demo

This project demonstrates:

- Dual draggable joysticks controller that reports directional input
- Dual characters (Red and blue small balls) that moves continuously based on joystick position
- Smooth animations running on the UI thread
- Proper boundary detection to keep the character on screen

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI (optional, included in dependencies)

### Installation

```bash
# Clone or copy this repository
cd RN-Game-Joystick

# Install dependencies
npm install

# Start the development server
npx expo start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app on your phone

## Project Structure

```
React-Native-Game-Dual-Joysticks/
├── app/
│   ├── _layout.tsx          # Root layout (minimal)
│   └── index.tsx            # Main game screen with joystick demo
├── components/
│   └── game/
│       ├── Joystick.tsx     # Virtual joystick component
│       ├── Character.tsx    # Moveable character component
│       └── README.md        # Detailed component documentation
├── assets/
│   └── images/              # App icons
│   └── display.gif          # APP display effect
│   └── double_joysticks.png # Double joystick code 
├── .gitignore               # Git ignore file
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Chinese document
└── README_en.md             # English document
|__SETUP.md                  # Setup instructions
```

## Usage

### Basic Implementation

```typescript
import { useCallback } from "react";
import { useSharedValue, useFrameCallback } from "react-native-reanimated";
import { Joystick, Character } from "@/components/game";

export default function GameScreen() {
  // Character position
  const characterX = useSharedValue(100);
  const characterY = useSharedValue(100);

  // Joystick input
  const joystickX = useSharedValue(0);
  const joystickY = useSharedValue(0);

  // Update every frame
  useFrameCallback(() => {
    characterX.value += joystickX.value * 5;
    characterY.value += joystickY.value * 5;
  });

  const handleJoystickMove = useCallback((x: number, y: number) => {
    joystickX.value = x;
    joystickY.value = y;
  }, []);

  return (
    <>
      <Character x={characterX} y={characterY} />
      <Joystick onMove={handleJoystickMove} />
    </>
  );
}
```

### Customisation

**Adjust movement speed:**

```typescript
const moveSpeed = 8; // If you want to move faster, increase this value
useFrameCallback(() => {
  characterX.value += joystickX.value * moveSpeed;
});
```

**Customise joystick appearance:**

```typescript
<Joystick
  size={200}
  stickSize={80}
  baseColor="rgba(33, 150, 243, 0.2)"
  stickColor="rgba(33, 150, 243, 0.8)"
/>
```

**Change character:**

```typescript
<Character x={x} y={y} size={80} color="#4CAF50" />
```

## What's Included

### Core Components

- `Joystick.tsx` - Virtual joystick with gesture handling
- `Character.tsx` - Moveable game character
- Full TypeScript support
- Documentation (you're reading it)

### Dependencies (Minimal)

- Expo ~54.0
- React Native Reanimated ~4.1.1 (with scheduleOnRN)
- React Native Gesture Handler ~2.28.0
- React Native Worklets 0.5.1

## How It Works

### Architecture

1. **Joystick Component**: Detects gestures and reports normalised x/y values (-1 to 1)
2. **Shared Values**: Store joystick input and character position
3. **Frame Callback**: Updates character position 60 times per second on UI thread
4. **Character Component**: Renders at the current position using Reanimated

### Threading Model

- **Gesture Detection**: UI thread (smooth, immediate response)
- **Callback Bridge**: Uses `scheduleOnRN` to communicate with JS thread
- **Position Updates**: UI thread via `useFrameCallback` (60fps performance)

This hybrid approach provides excellent performance while keeping the code simple and maintainable.

## Key Dependencies

- **expo**: ~54.0.23 - React Native framework
- **react-native-reanimated**: ~4.1.1 - 60fps animations on UI thread
- **react-native-gesture-handler**: ~2.28.0 - Gesture detection
- **react-native-worklets**: 0.5.1 - Thread communication (scheduleOnRN)
- **expo-router**: ~6.0.14 - File-based routing

## Documentation

For detailed component documentation, implementation details, and advanced usage, see:

- [Component Documentation](./components/game/README.md) - In-depth guide with performance analysis

## Performance

- ✅ Smooth 60fps on modern devices
- ✅ Optimised for single character (this demo)
- ✅ Can handle 1-10 characters without performance issues
- ⚠️ For 100+ entities, consider pure UI thread optimisation (see component README)

## Troubleshooting Tips

### Console.log crashes in worklets

**Problem**: Using `console.log` inside `useFrameCallback` crashes.

**Solution**: Use `scheduleOnRN`:

```typescript
import { scheduleOnRN } from "react-native-worklets";

useFrameCallback(() => {
  scheduleOnRN(console.log, "Position:", x.value);
});
```

### Character doesn't move continuously

**Problem**: Character stops when joystick is held steady.

**Solution**: Use `useFrameCallback` to poll joystick values every frame (already implemented in this demo).

### Gestures not working

**Problem**: Joystick doesn't respond to touch.

**Solution**: Ensure your app is wrapped in `GestureHandlerRootView` (already done in `app/index.tsx`).

## Extending This Demo

Ideas for enhancement:

- Add multiple characters
- Implement collision detection
- Add enemies or obstacles
- Implement shooting/actions with additional buttons
- Add acceleration/momentum physics
- Create a game arena with boundaries
- Add score tracking

## Learn More

- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Worklets Docs](https://docs.swmansion.com/react-native-worklets/)
- [React Native Gesture Handler Docs](https://docs.swmansion.com/react-native-gesture-handler/)
- [Expo Documentation](https://docs.expo.dev/)

## Licence

MIT

---

**Note**: This is a minimal demo focusing purely on the joystick controller functionality. It intentionally excludes theme systems, navigation complexity, and other boilerplate to keep the implementation clear and easy to understand.
It was originally built from an out-of-the-box Expo app template (using `npx create-expo-app@latest` with Expo SDK 54), and then simplified to remove unnecessary complexity. I offer no guarantees for this project.

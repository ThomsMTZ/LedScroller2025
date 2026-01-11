# LedScroller2025

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)

A dynamic LED-style scrolling text display application built with React Native and Expo. Create mesmerizing scrolling text animations with customizable colors, speeds, and sizes - perfect for creating digital signage, message boards, or eye-catching displays on your mobile device.

## ✨ Features

- 🎨 **Customizable Text Color**: Choose from a full spectrum of colors using an intuitive hue slider
- ⚡ **Adjustable Speed Control**: Fine-tune the scrolling speed to your preference (1-20 seconds per cycle)
- 📏 **Pinch-to-Zoom**: Dynamically resize text using intuitive pinch gestures
- 🎯 **LED Grid Overlay**: Authentic retro LED display aesthetic with customizable grid
- ⚙️ **Settings Modal**: Easy-to-access configuration via double-tap gesture
- 🌈 **Smooth Animations**: Powered by React Native Reanimated for silky-smooth 60fps animations
- 📱 **Cross-Platform**: Runs on iOS, Android, and Web
- 🎭 **Custom LED Font**: Uses the Codystar font for an authentic LED display look

## 🚀 Demo

The app displays scrolling text in a neon LED style with a grid overlay, creating a nostalgic digital display effect. Users can:
- Double-tap to open settings
- Pinch to zoom in/out on the text
- Customize text content, color, and animation speed in real-time

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [Issues History](#issues-history)
- [License](#license)
- [Contact](#contact)

## 💾 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or later recommended)
- **npm** or **yarn**
- **Expo CLI** (optional, but recommended)
- For iOS: **Xcode** (on macOS)
- For Android: **Android Studio** and Android SDK

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ThomsMTZ/LedScroller2025.git
   cd LedScroller2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - For iOS: Press `i` in the terminal or run `npm run ios`
   - For Android: Press `a` in the terminal or run `npm run android`
   - For Web: Press `w` in the terminal or run `npm run web`
   - Or scan the QR code with the Expo Go app on your mobile device

## 📖 Usage

### Basic Usage

1. **Launch the app** on your device or emulator
2. **Default message** "BONJOUR 2025" will start scrolling automatically
3. **Double-tap anywhere** on the screen to open the settings modal
4. **Customize your display**:
   - Enter custom text in the input field
   - Adjust the color using the hue slider
   - Control the speed with the speed slider
5. **Pinch gesture** on the scrolling text to zoom in/out
6. **Close settings** by tapping the close button

### Advanced Features

- **Gesture Controls**: The app uses React Native Gesture Handler for smooth, responsive interactions
- **Real-time Updates**: All changes are applied instantly without needing to restart the animation
- **Thread-safe Animations**: Powered by Reanimated's worklet architecture for optimal performance

## 🛠 Technologies

This project is built with:

- **[Expo](https://expo.dev/)** (~54.0.31) - Development platform and framework
- **[React Native](https://reactnative.dev/)** (0.81.5) - Mobile app framework
- **[React](https://react.dev/)** (19.1.0) - UI library
- **[TypeScript](https://www.typescriptlang.org/)** (~5.9.2) - Type-safe JavaScript
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** (~4.1.1) - Advanced animations
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** (~2.28.0) - Touch and gesture system
- **[Expo Router](https://expo.github.io/router/)** (~6.0.21) - File-based routing
- **[@expo-google-fonts/codystar](https://github.com/expo/google-fonts)** - LED-style font
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** (~15.0.8) - Gradient effects

## 📁 Project Structure

```
LedScroller2025/
├── app/                    # App entry point
│   └── index.tsx          # Main app component
├── components/            # Reusable React components
│   ├── ColorSelector.tsx  # Color picker component
│   ├── GridOverlay.tsx    # LED grid overlay
│   ├── HintContainer.tsx  # User hints display
│   ├── LedScroller.tsx    # Main scroller component
│   ├── SettingsModal.tsx  # Settings configuration modal
│   ├── index.ts           # Component exports
│   ├── styles.ts          # Shared styles
│   └── types.ts           # TypeScript type definitions
├── assets/                # Static assets
│   ├── icon.png          # App icon
│   ├── splash-icon.png   # Splash screen
│   ├── adaptive-icon.png # Android adaptive icon
│   └── favicon.png       # Web favicon
├── .github/              # GitHub configuration
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── babel.config.js       # Babel configuration
├── eslint.config.js      # ESLint configuration
├── TROUBLESHOOTING.md    # Known issues and solutions
└── README.md             # This file
```

## ⚙️ Configuration

### App Configuration

The main configuration is in `app.json`:
- App name, slug, and version
- Orientation settings (portrait mode)
- Platform-specific settings (iOS, Android, Web)
- Icon and splash screen configuration

### Customizing Default Values

Edit `components/LedScroller.tsx` to change defaults:

```typescript
const LedScroller: React.FC<LedScrollerProps> = ({ 
  initialText = 'YOUR TEXT HERE' // Change default text
}) => {
  const [hue, setHue] = useState<number>(120);    // Default color (0-360)
  const [speed, setSpeed] = useState<number>(10000); // Default speed in ms
  // ...
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

Please ensure your code:
- Follows the existing code style
- Passes all linting checks (`npm run lint`)
- Includes appropriate TypeScript types
- Is well-documented with comments where necessary

## 🔧 Troubleshooting

For detailed troubleshooting information, please see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

### Common Issues

**Issue**: App crashes on Android with "Worklet version mismatch"
- **Solution**: Ensure you're using the exact dependency versions specified in `package.json`. Run `npm install` to sync.

**Issue**: "runOnJS is deprecated" warning
- **Solution**: The project correctly uses `.runOnJS(true)` on gestures instead of importing `runOnJS` from Reanimated. This warning can be safely ignored if using the latest code.

**Issue**: Fonts not loading
- **Solution**: Ensure you have a stable internet connection on first run. The Codystar font is downloaded from Google Fonts.

## 🔮 Future Improvements

Here are planned features and enhancements for future versions:

### High Priority
- [ ] **Text Effects**: Add animation effects like fade, blink, rainbow cycling
- [ ] **Multiple Text Presets**: Save and quickly switch between favorite text/color combinations
- [ ] **Background Customization**: Allow users to change background color or add gradient backgrounds
- [ ] **Font Selection**: Support for multiple LED-style fonts
- [ ] **Vertical Scrolling**: Add option for vertical scrolling mode

### Medium Priority
- [ ] **Export/Share Feature**: Allow users to record and share their LED displays as videos or GIFs
- [ ] **Rotation Support**: Enable landscape mode for wider displays
- [ ] **Multiple Lines**: Support multi-line scrolling text
- [ ] **Border Customization**: Adjustable LED grid size, color, and visibility
- [ ] **Haptic Feedback**: Add vibration feedback for better UX

### Low Priority
- [ ] **Theme System**: Light/dark mode support
- [ ] **Accessibility**: VoiceOver/TalkBack support, larger touch targets
- [ ] **Internationalization**: Multi-language support for UI
- [ ] **Performance Metrics**: FPS counter and performance monitoring in dev mode
- [ ] **Advanced Animations**: Ease-in/ease-out, bounce effects, custom timing curves

### Research & Exploration
- [ ] **Bluetooth Integration**: Control multiple devices simultaneously
- [ ] **Web Socket Support**: Remote control from web interface
- [ ] **AR Mode**: Display scrolling text in augmented reality
- [ ] **Battery Optimization**: Reduce power consumption for longer display sessions

## 📜 Issues History

This section documents significant bugs, issues, and their resolutions throughout the project's development.

### Resolved Issues

#### Issue #1: Worklet Version Mismatch / NullPointerException (Resolved)
- **Date**: During initial Expo SDK 54 migration
- **Severity**: Critical - App crash on Android
- **Description**: Mismatch between JavaScript and native Worklets versions (0.6.1 vs 0.5.1) causing `NullPointerException` on app launch
- **Root Cause**: Dependency conflict between Reanimated 4.x and Gesture Handler versions during Expo SDK 54 beta
- **Solution**: Aligned to Expo SDK 54 recommended versions:
  - `react-native-reanimated`: ~4.1.1
  - `react-native-gesture-handler`: ~2.28.0
  - Removed manual `overrides` in package.json
- **Status**: ✅ Resolved
- **Reference**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#1-worklet-version-mismatch--nullpointerexception)

#### Issue #2: runOnJS Deprecation Warning (Resolved)
- **Date**: During Reanimated 4.x upgrade
- **Severity**: Low - Warning only, non-breaking
- **Description**: Deprecation warning for importing `runOnJS` from `react-native-reanimated`
- **Root Cause**: Reanimated 4 architecture moved `runOnJS` to separate package, but direct import from `react-native-worklets` is unstable in Expo
- **Solution**: Refactored to use native Gesture Handler v2 thread switching:
  ```typescript
  // Changed from: runOnJS(setOpen)(true)
  // To: .runOnJS(true) on the gesture definition
  ```
- **Status**: ✅ Resolved
- **Reference**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#2-runonjs-is-deprecated-warning)

### Known Issues

Currently, there are no known unresolved issues. If you encounter a problem, please:
1. Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file
2. Search existing [GitHub Issues](https://github.com/ThomsMTZ/LedScroller2025/issues)
3. Create a new issue with detailed reproduction steps if needed

### How to Report Issues

When reporting an issue, please include:
- Device/Platform (iOS/Android/Web)
- OS version
- App version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or video if applicable
- Error messages or logs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Thomas Martinez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 📧 Contact

**Thomas Martinez**

- GitHub: [@ThomsMTZ](https://github.com/ThomsMTZ)
- Project Link: [https://github.com/ThomsMTZ/LedScroller2025](https://github.com/ThomsMTZ/LedScroller2025)

---

## 🙏 Acknowledgments

- [FreeCodeCamp](https://www.freecodecamp.org/) for README best practices guide
- [Expo Team](https://expo.dev/) for the excellent development platform
- [Software Mansion](https://swmansion.com/) for Reanimated and Gesture Handler libraries
- [Google Fonts](https://fonts.google.com/) for the Codystar font
- The React Native community for continuous support and inspiration

---

Made with ❤️ by Thomas Martinez | 2025

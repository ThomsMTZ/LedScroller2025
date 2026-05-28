# LedScroller2025

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)

A dynamic LED-style scrolling text display application built with React Native and Expo. Create mesmerizing scrolling text animations with customizable colors, speeds, and sizes - perfect for creating digital signage, message boards, or eye-catching displays on your mobile device.

## Features

- 🎨 **Customizable Text Color**: Choose from a full spectrum of colors using an intuitive hue slider.
- ⚡ **Adjustable Speed Control**: Fine-tune the scrolling speed to your preference.
- 📏 **Pinch-to-Zoom**: Dynamically resize text using intuitive pinch gestures.
- 🎯 **LED Grid Overlay**: Authentic retro LED display aesthetic.
- ⚙️ **Settings Modal**: Easy-to-access configuration via double-tap gesture.
- 🌈 **Smooth Animations**: Powered by React Native Reanimated for silky-smooth 60fps animations.
- 📱 **Cross-Platform**: Runs on iOS, Android, and Web.
- 🎭 **Custom LED Font**: Uses the Codystar font for an authentic LED display look.
- 🕒 **Message History & Favorites**: Easily access recently used messages and save your favorites.
- 🔄 **Scroll Direction & Orientation**: Toggle right-to-left/left-to-right scrolling and lock landscape mode.
- ✨ **Advanced LED Effects**: Enable blinking text, blinking borders, or dynamic chase border animations.

## Demo

The app displays scrolling text in a neon LED style with a grid overlay. Users can:

- Double-tap to open settings.
- Pinch to zoom in/out on the text.
- Customize text content, color, and animation speed in real-time.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

## Installation

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Expo CLI** (optional, but recommended)
- For iOS: **Xcode** (on macOS)
- For Android: **Android Studio**

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
3. **Start the development server**
   ```bash
   npm start
   ```
4. **Run on your preferred platform**
    - Press `i` for iOS, `a` for Android, or `w` for Web.
    - Or scan the QR code with the Expo Go app.

## Usage

1. **Launch the app**.
2. **Double-tap anywhere** to open the settings modal.
3. **Customize your display**: text, color, speed, and visual effects.
4. **Pinch gesture** on the scrolling text to zoom.
5. **Close settings** by tapping the close button.

## Technologies

- **[Expo](https://expo.dev/)** (~54.0)
- **[React Native](https://reactnative.dev/)** (0.81.5)
- **[React](https://react.dev/)** (19.1.0)
- **[TypeScript](https://www.typescriptlang.org/)** (~5.9.2)
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** (~4.1.1) - For animations.
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** (~2.28.0) - For touch
  interactions.
- **[Expo Router](https://expo.github.io/router/)** (~6.0.21) - For routing.

## Project Structure

The project follows a component-based architecture, with a clear separation between state management, animation logic,
and UI rendering.

```text
LedScroller2025/
├── app/
│   └── index.tsx           # App entry point, renders LedScroller
├── components/
│   ├── SettingsModal/      # The settings modal and its sub-components
│   ├── LedDisplayPanel.tsx # Renders the entire LED panel, text, and effects
│   ├── LedScroller.tsx     # Main component: orchestrates hooks and UI
│   ├── useLedSettings.tsx  # Hook for managing all user settings and state
│   ├── useLedAnimation.tsx # Hook for managing all Reanimated animations
│   ├── LedBorder.tsx       # Animated "chase" border effect
│   ├── GridOverlay.tsx     # Static grid overlay for LED effect
│   └── ...                 # Other shared components
├── test/
│   ├── LedDisplayPanel.test.tsx
│   ├── LedScroller.test.tsx
│   ├── useLedSettings.test.ts
│   └── useLedAnimation.test.ts
│   └── ...                 # Other test files
├── assets/
├── ...                     # Other configuration files
└── README.md
```

### Core Components & Hooks

- **`LedScroller.tsx`**: The main screen component. It acts as an orchestrator. It doesn't contain much JSX, but
  instead:
    - Initializes the `useLedSettings` and `useLedAnimation` hooks.
    - Passes state and animation values down to child components.
    - Renders the main layout, `LedDisplayPanel`, and `SettingsModal`.

- **`LedDisplayPanel.tsx`**: A purely presentational component that is responsible for rendering the entire visual part
  of the LED display. It receives all necessary props from `LedScroller` and contains the logic for:
    - Displaying the scrolling text (`Animated.Text`).
    - Rendering the `LedBorder` or a native border.
    - Applying all animated styles.

- **`useLedSettings.tsx`**: A custom hook that centralizes all application state and business logic.
    - Manages settings like text, speed, color, etc.
    - Handles loading and saving settings to `AsyncStorage`.
    - Provides functions to update the state.
    - This hook makes the components cleaner by abstracting away the state management logic.

- **`useLedAnimation.tsx`**: A custom hook dedicated to handling all `react-native-reanimated` logic.
    - Creates and manages all shared values (e.g., `translateX`, `fontSize`).
    - Defines the animations for scrolling, blinking, and color transitions.
    - Sets up gesture handlers (`pinch`, `double-tap`).
    - Returns animated styles to be applied to the components.

- **`SettingsModal/`**: The modal view for all user-configurable settings. It is self-contained and communicates with
  the rest of the app via props passed from `LedScroller`.

This architecture promotes a clean separation of concerns, making the project easier to maintain and debug.

## Contributing

Contributions are welcome! Please fork the repository and open a pull request with your changes.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## Troubleshooting

Please see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

**Thomas Martinez**
- GitHub: [@ThomsMTZ](https://github.com/ThomsMTZ)
- Project Link: [https://github.com/ThomsMTZ/LedScroller2025](https://github.com/ThomsMTZ/LedScroller2025)

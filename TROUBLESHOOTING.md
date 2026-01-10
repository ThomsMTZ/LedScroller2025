# Troubleshooting & Known Issues - LedScroller2025

This document records the technical issues encountered during the development of the **LedScroller2025** application and their specific solutions to ensure stability on Android (Expo Go).

## 🛠 Environment Context

- **Framework:** Expo SDK 54 (Beta/Rollout phase)
- **React Native:** 0.81.5
- **Critical Libraries:** - `react-native-reanimated` (~4.1.1)
    - `react-native-gesture-handler` (~2.28.0)

---

## 📋 Table of Contents
1. [Worklet Version Mismatch / NullPointerException](#1-worklet-version-mismatch--nullpointerexception)
2. ["runOnJS is deprecated" Warning](#2-runonjs-is-deprecated-warning)


---

## 1. Worklet Version Mismatch / NullPointerException

### 🔴 The Error

Runtime crash on Android (Expo Go) launching the app:
> `Mismatch between JavaScript part and native part of Worklets (0.6.1 vs 0.5.1)`
> `java.lang.NullPointerException: HostObject::get for prop 'ReanimatedModule'`

### 🧐 The Cause

This is a **Dependency Hell** scenario specific to the Expo SDK 54 transition.

- **Root Cause:** Attempting to mix Reanimated 3.x with Gesture Handler 2.28 (Bleeding Edge), or conversely, forcing
  older "Worklet" versions via `overrides` while using Reanimated 4.
- This creates a desynchronization between the Native C++ binaries in the Expo Go client and the JavaScript bundle.

### ✅ The Solution

**Align strictly with Expo Doctor recommendations.** Do not manually force versions or use `overrides` in
`package.json`.

1. **Package.json Configuration:**
   Ensure these exact versions are used (Standard for SDK 54):
   ```json
   "dependencies": {
     "react-native-gesture-handler": "~2.28.0",
     "react-native-reanimated": "~4.1.1"
   }

## 2. "runOnJS is deprecated" Warning

### 🔴 The Error The Issue

The Metro Bundler or IDE throws a warning:

> `Deprecated symbol used... Please import runOnJS directly from react-native-worklet`

### 🧐 The Cause

In Reanimated 4 architecture, runOnJS is moving to a separate package. Importing it from react-native-reanimated is
deprecated. However, manually importing it from react-native-worklets is unstable in the current Expo ecosystem.

### ✅ The Solution

**Stop importing runOnJS manually. Use the native method provided by Gesture Handler v2 to switch threads context.**

**Before (Bad Practice):**

*TypeScript*

import { runOnJS } from 'react-native-reanimated';
// ...
.onEnd(() => {
runOnJS(setOpen)(true); // Manual wrapper
})

**After (Best Practice):**

*TypeScript*

// No import needed from Reanimated
const doubleTap = Gesture.Tap()
.runOnJS(true) // <--- Native thread switching handled by the library
.onEnd(() => {
setOpen(true); // Call JS function directly
});
module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['./jest.setup.ts'],
    transformIgnorePatterns: [
        'node_modules/(?!' +
        [
            [
                // Core React Native and community packages that must be transformed by Babel.
                '((jest-)?react-native|@react-native(-community)?)',
                // Expo runtime and legacy "Exponent" package names that ship untranspiled code.
                'expo(nent)?',
                // All scoped Expo packages (e.g. @expo/vector-icons) that require transformation.
                '@expo(nent)?/.*',
                // Expo Google Fonts packages that are distributed as modern JS.
                '@expo-google-fonts/.*',
                // React Navigation core package.
                'react-navigation',
                // All scoped React Navigation packages.
                '@react-navigation/.*',
                // Unimodules (Expo modular packages) that need to be transformed.
                '@unimodules/.*',
                // Unscoped unimodules entry points.
                'unimodules',
                // Sentry integration for Expo, which includes modern JS syntax.
                'sentry-expo',
                // NativeBase UI library targeting React Native.
                'native-base',
                // React Native SVG implementation.
                'react-native-svg',
                // React Native Reanimated library requiring Babel plugin support.
                'react-native-reanimated',
                // Expo Linear Gradient component.
                'expo-linear-gradient',
                // Expo Image component.
                'expo-image',
                // Expo Router navigation for file-based routing.
                'expo-router',
                // Expo font loading utilities.
                'expo-font',
                // Expo haptics utilities for vibration/tactile feedback.
                'expo-haptics',
                // Expo symbols (SF Symbols on iOS, etc.).
                'expo-symbols',
                // Async storage implementation for React Native.
                '@react-native-async-storage',
                // Additional React Native community-maintained packages.
                '@react-native-community'
            ].join('|') +
            ')',
        ],],
};
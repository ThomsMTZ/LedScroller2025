/* eslint-disable @typescript-eslint/no-require-imports */
import 'react-native-gesture-handler/jestSetup';

// 1. Mock de Reanimated
jest.mock('react-native-reanimated', () =>
    require('react-native-reanimated/mock')
);

// 2. Mock de AsyncStorage (Persistance)
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 3. Mock de ScreenOrientation (Orientation)
jest.mock('expo-screen-orientation', () => ({
    lockAsync: jest.fn(),
    unlockAsync: jest.fn(),
    OrientationLock: {
        LANDSCAPE: 'LANDSCAPE',
        PORTRAIT: 'PORTRAIT',
    },
}));

// 4. Mock de Gesture Handler (Gestes tactiles)
jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native').View;

    const mockChainableGesture = {
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        numberOfTaps: jest.fn().mockReturnThis(),
        runOnJS: jest.fn().mockReturnThis(),
    };

    return {
        GestureDetector: View,
        GestureHandlerRootView: View,
        Gesture: {
            Pinch: () => mockChainableGesture,
            Tap: () => mockChainableGesture,
            Race: jest.fn(),
            Simultaneous: jest.fn(),
        },
        State: {},
        Directions: {},
    };
});

// 5. Mock de LinearGradient (Visuel)
jest.mock('expo-linear-gradient', () => ({
    LinearGradient: 'LinearGradient'
}));

// 6. Mock des Fonts (Google Fonts)
jest.mock('@expo-google-fonts/codystar', () => ({
    Codystar_400Regular: 'Codystar_400Regular',
}));

// 7. Mock des Icones (Ionicons)
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

// 8. Mock des Pubs
jest.mock('react-native-google-mobile-ads', () => ({
    BannerAd: 'BannerAd',
    BannerAdSize: {BANNER: 'BANNER'},
    TestIds: {BANNER: 'test-banner'}
}));

// 9. Mock du Slider
jest.mock('@react-native-community/slider', () => 'Slider');
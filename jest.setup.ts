// jest.setup.ts

// 1. Mock de Reanimated (CORRECTIF POUR V4)
// Au lieu de chercher le fichier jestUtils qui a bougé,
// on utilise le mock global fourni par la librairie.
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
    return {
        GestureDetector: View,
        GestureHandlerRootView: View,
        Gesture: {
            Pinch: () => ({
                onUpdate: () => ({
                    onEnd: () => {
                    }
                })
            }),
            Tap: () => ({
                numberOfTaps: () => ({
                    runOnJS: () => ({
                        onEnd: () => {
                        }
                    })
                })
            }),
            Race: () => {
            },
        },
        // Ajout important pour éviter certaines erreurs de rendu
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
    useFonts: () => [true],
    Codystar_400Regular: 'Codystar_400Regular',
}));

// 7. Mock des Icones (Ionicons)
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));
import React from 'react';
import {render} from '@testing-library/react-native';
import {LedScroller} from "../components";

jest.mock('../components/useLedSettings', () => ({
    useLedSettings: jest.fn(() => ({
        isLoaded: true,
        text: 'Alivio Test',
        speed: 150,
        selectedColor: {hue: 0, saturation: 100, lightness: 50, name: 'Rouge'},
        showBorder: true,
        isBorderChase: true,
        isBorderBlinking: false,
        isLandscapeLocked: false,
        isTextBlinking: false,
        isReverseScroll: false,
        recentMessages: [],
        favoriteMessages: [],
        onTextChange: jest.fn(),
        onSpeedChange: jest.fn(),
        onColorChange: jest.fn(),
        onToggleBorder: jest.fn(),
        onToggleBorderChase: jest.fn(),
        onToggleBorderBlinking: jest.fn(),
        onToggleOrientation: jest.fn(),
        onToggleTextBlinking: jest.fn(),
        onToggleReverseScroll: jest.fn(),
        onSelectRecentMessage: jest.fn(),
        onToggleFavorite: jest.fn(),
    }))
}));

jest.mock('../components/useLedAnimation', () => ({
    useLedAnimations: jest.fn(() => ({
        componentId: 'mock-id',
        composedGestures: {},
        animatedContainerStyle: {transform: []},
        animatedTextStyle: {fontSize: 120},
    }))
}));

jest.mock('../components/LedBorder', () => 'LedBorder');
jest.mock('../index', () => ({SettingsModal: 'SettingsModal'}));
jest.mock('react-native-gesture-handler', () => ({
    GestureDetector: ({children}: any) => children,
}));

describe('LedScroller Orchestrator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait afficher l’écran de chargement si isLoaded est false', () => {
        const {useLedSettings} = require('../components/useLedSettings');

        const defaultMockSettings = useLedSettings();

        useLedSettings.mockReturnValueOnce({
            ...defaultMockSettings,
            isLoaded: false
        });

        const {UNSAFE_getByType} = render(<LedScroller/>);
        const {ActivityIndicator} = require('react-native');

        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('devrait rendre l’interface principale et distribuer le texte animé une fois chargé', () => {
        const {getByTestId, getAllByText} = render(<LedScroller/>);

        expect(getByTestId('interactive-view')).toBeTruthy();

        const textCopies = getAllByText('Alivio Test');
        expect(textCopies.length).toBeGreaterThan(0);
    });
});
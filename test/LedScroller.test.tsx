import React from 'react';
import {render} from '@testing-library/react-native';
import {LedScroller} from "../components";

jest.mock('../components/useLedSettings', () => ({
    useLedSettings: jest.fn(() => ({
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
        isSettingsOpen: false,
        setText: jest.fn(),
        setSpeed: jest.fn(),
        setSelectedColor: jest.fn(),
        onOpenSettings: jest.fn(),
        onCloseSettings: jest.fn(),
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
    useLedAnimation: jest.fn(() => ({
        componentId: 'mock-id',
        setTextWidth: jest.fn(),
        copiesArray: [undefined, undefined],
        LOOP_SPACING: 100,
        PORTRAIT_PANEL_HEIGHT: 200,
        hueVal: {value: 0},
        satVal: {value: 100},
        ligVal: {value: 50},
        composedGestures: {},
        animatedContainerStyle: {transform: []},
        animatedTextStyle: {fontSize: 120},
        animatedBorderOpacityStyle: {opacity: 1},
        animatedBorderColorStyle: {borderColor: 'red'},
        animatedShadowColorStyle: {shadowColor: 'red'},
    }))
}));

jest.mock('../components/LedBorder', () => 'LedBorder');
jest.mock('../index', () => ({SettingsModal: 'SettingsModal'}));
jest.mock('react-native-gesture-handler', () => ({
    GestureDetector: ({children}: any) => children,
    Gesture: {
        Tap: () => ({numberOfTaps: () => ({runOnJS: () => ({onEnd: () => ({})})})}),
        Pinch: () => ({onUpdate: () => ({onEnd: () => ({})})}),
        Race: () => ({}),
    },
}));

describe('LedScroller Orchestrator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait rendre l\'interface principale et distribuer le texte animé', () => {
        const {getByTestId, getAllByText} = render(<LedScroller/>);

        expect(getByTestId('gesture-detector')).toBeTruthy();

        const textCopies = getAllByText('Alivio Test');
        expect(textCopies.length).toBeGreaterThan(0);
    });

    it('devrait afficher le led-display', () => {
        const {getByTestId} = render(<LedScroller/>);
        expect(getByTestId('led-display')).toBeTruthy();
    });
});

import React from 'react';
import {render} from '@testing-library/react-native';
import LedScroller from '../../components/display/LedScroller';
import {useSettings} from '../../context/SettingsContext';
import {useLedAnimation} from '../../hooks/useLedAnimation';

// Mocks des hooks
jest.mock('../../context/SettingsContext', () => ({
    useSettings: jest.fn(() => ({
        text: 'Mocked Text',
        isSettingsOpen: false,
        onOpenSettings: jest.fn(),
        borderColor: { hue: 0, saturation: 100, lightness: 50 },
        selectedColor: { hue: 0, saturation: 100, lightness: 50 },
    })),
}));

jest.mock('../../hooks/useLedAnimation', () => ({
    useLedAnimation: jest.fn(() => ({
        composedGestures: {},
        // ... autres props si nécessaires pour le rendu
    })),
}));

// Mock du composant enfant principal
jest.mock('../../components/display/LedDisplayPanel', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const {View} = require('react-native');
    return function MockLedDisplayPanel(props: any) { return <View testID="mock-led-display-panel" {...props} />; };
});

jest.mock('../../components/SettingsModal/SettingsModal', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const {View} = require('react-native');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const {useSettings} = require('../../context/SettingsContext');
    return function MockSettingsModal() { 
        const {isSettingsOpen} = useSettings();
        return isSettingsOpen ? <View testID="mock-settings-modal"/> : null; 
    };
});

describe('LedScroller Component', () => {
    const useSettingsMock = useSettings as jest.Mock;
    const useLedAnimationMock = useLedAnimation as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        // Configuration par défaut pour les mocks des hooks
        useSettingsMock.mockReturnValue({
            text: 'Default Text',
            isSettingsOpen: false,
            onOpenSettings: jest.fn(),
            showBorder: true,
            isBorderChase: true,
            borderColor: { hue: 0, saturation: 100, lightness: 50 },
            selectedColor: { hue: 0, saturation: 100, lightness: 50 },
        });
        useLedAnimationMock.mockReturnValue({
            composedGestures: {},
            PORTRAIT_PANEL_HEIGHT: 200,
        });
    });

    it('devrait rendre le composant LedDisplayPanel', () => {
        const {getByTestId} = render(<LedScroller/>);
        expect(getByTestId('mock-led-display-panel')).toBeTruthy();
    });

    it('devrait passer les bonnes props à LedDisplayPanel', () => {
        const {getByTestId} = render(<LedScroller/>);
        const panel = getByTestId('mock-led-display-panel');

        expect(panel.props.display.text).toBe('Default Text');
        expect(panel.props.layout.isChaseActive).toBe(true);
        expect(panel.props.animation.PORTRAIT_PANEL_HEIGHT).toBe(200);
    });

    it('devrait rendre le SettingsModal quand isSettingsOpen est true', () => {
        useSettingsMock.mockReturnValue({
            ...useSettingsMock(),
            isSettingsOpen: true,
        });

        const {getByTestId} = render(<LedScroller/>);
        expect(getByTestId('mock-settings-modal')).toBeTruthy();
    });

    it('ne devrait pas rendre le SettingsModal quand isSettingsOpen est false', () => {
        const {queryByTestId} = render(<LedScroller/>);
        expect(queryByTestId('mock-settings-modal')).toBeNull();
    });
});

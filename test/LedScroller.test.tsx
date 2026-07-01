import React from 'react';
import {render} from '@testing-library/react-native';
import LedScroller from '../components/LedScroller';
import {useLedSettings} from '../components/useLedSettings';
import {useLedAnimation} from '../components/useLedAnimation';

// Mocks des hooks
jest.mock('../components/useLedSettings', () => ({
    useLedSettings: jest.fn(() => ({
        text: 'Mocked Text',
        isSettingsOpen: false,
        onOpenSettings: jest.fn(),
        // ... autres props si nécessaires pour le rendu
    })),
}));

jest.mock('../components/useLedAnimation', () => ({
    useLedAnimation: jest.fn(() => ({
        composedGestures: {},
        // ... autres props si nécessaires pour le rendu
    })),
}));

// Mock du composant enfant principal
jest.mock('../components/LedDisplayPanel', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const {View} = require('react-native');
    return function MockLedDisplayPanel(props: any) { return <View testID="mock-led-display-panel" {...props} />; };
});

jest.mock('../components/SettingsModal/SettingsModal', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const {View} = require('react-native');
    return function MockSettingsModal(props: any) { return props.visible ? <View testID="mock-settings-modal"/> : null; };
});

describe('LedScroller Component', () => {
    const useLedSettingsMock = useLedSettings as jest.Mock;
    const useLedAnimationMock = useLedAnimation as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        // Configuration par défaut pour les mocks des hooks
        useLedSettingsMock.mockReturnValue({
            text: 'Default Text',
            isSettingsOpen: false,
            onOpenSettings: jest.fn(),
            showBorder: true,
            isBorderChase: true,
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
        useLedSettingsMock.mockReturnValue({
            ...useLedSettingsMock(),
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

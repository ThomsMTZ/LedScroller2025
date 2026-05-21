import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {LED_COLORS} from "../../components";
import {SettingsProvider} from "../../context/SettingsContext";
import {OrientationSection} from "../../components/SettingsModal/components/OrientationSection";

const mockContext = {
    isLandscapeLocked: false,
    onToggleOrientation: jest.fn(),
    currentHsl: 'hsl(0, 0%, 100%)',
    text: '', onTextChange: jest.fn(), speed: 100, onSpeedChange: jest.fn(),
    selectedColor: LED_COLORS[0], onColorChange: jest.fn(), showBorder: false,
    onToggleBorder: jest.fn(), isBorderChase: false, onToggleBorderChase: jest.fn(),
    isBorderBlinking: false, onToggleBorderBlinking: jest.fn(), isTextBlinking: false,
    onToggleTextBlinking: jest.fn(), isReverseScroll: false, onToggleReverseScroll: jest.fn(),
    recentMessages: [], favoriteMessages: [], onSelectRecentMessage: jest.fn(), onToggleFavorite: jest.fn()
};

describe('OrientationSection Component', () => {
    it('devrait afficher "Rotation Automatique" quand isLandscapeLocked est false', () => {
        const {getByText} = render(
            <SettingsProvider value={mockContext}>
                <OrientationSection/>
            </SettingsProvider>
        );
        expect(getByText('Rotation Automatique')).toBeTruthy();
    });

    it('devrait afficher "Mode Paysage Forcé" quand isLandscapeLocked est true', () => {
        const lockedContext = {...mockContext, isLandscapeLocked: true};
        const {getByTestId} = render(
            <SettingsProvider value={lockedContext}>
                <OrientationSection/>
            </SettingsProvider>
        );

        const button = getByTestId('orientation-button');

        fireEvent.press(button);
        expect(mockContext.onToggleOrientation).toHaveBeenCalledTimes(1);
    });
});
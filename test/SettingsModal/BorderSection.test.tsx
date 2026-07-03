import React from 'react';
import {render} from '@testing-library/react-native';
import {LED_COLORS} from "../../components";
import {SettingsProvider} from "../../context/SettingsContext";
import {BorderSection} from "../../components/SettingsModal/components/BorderSection";


const mockContext = {
    showBorder: true,
    isBorderChase: true,
    isBorderBlinking: false,
    onToggleBorder: jest.fn(),
    onToggleBorderChase: jest.fn(),
    onToggleBorderBlinking: jest.fn(),
    currentHsl: 'hsl(0, 100%, 50%)',
    currentBorderHsl: 'hsl(0, 100%, 50%)',
    borderColor: LED_COLORS[0],
    onBorderColorChange: jest.fn(),
    text: '', onTextChange: jest.fn(), speed: 100, onSpeedChange: jest.fn(),
    selectedColor: LED_COLORS[0], onColorChange: jest.fn(),
    isLandscapeLocked: false, onToggleOrientation: jest.fn(),
    isTextBlinking: false, onToggleTextBlinking: jest.fn(),
    isReverseScroll: false, onToggleReverseScroll: jest.fn(),
    recentMessages: [], favoriteMessages: [], onSelectRecentMessage: jest.fn(), onToggleFavorite: jest.fn()
};

describe('BorderSection Component', () => {
    it('devrait afficher les options avancées si showBorder est true', () => {
        const {getByTestId} = render(
            <SettingsProvider value={mockContext}>
                <BorderSection/>
            </SettingsProvider>
        );

        expect(getByTestId('border-button')).toBeTruthy();
        expect(getByTestId('chase-border-button')).toBeTruthy();
        expect(getByTestId('blink-border-button')).toBeTruthy();
    });

    it('ne devrait pas afficher les boutons de style si showBorder est false', () => {
        const contextDisabled = {...mockContext, showBorder: false};
        const {queryByTestId} = render(
            <SettingsProvider value={contextDisabled}>
                <BorderSection/>
            </SettingsProvider>
        );

        expect(queryByTestId('chase-border-button')).toBeNull();
        expect(queryByTestId('blink-border-button')).toBeNull();
    });
});
import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {SettingsProvider} from "../../context/SettingsContext";
import {DisplayTextSection} from "../../components/SettingsModal/components/DisplayTextSection";
import {LED_COLORS} from "../../components";

const mockContext = {
    isTextBlinking: true,
    isReverseScroll: false,
    onToggleTextBlinking: jest.fn(),
    onToggleReverseScroll: jest.fn(),
    currentHsl: 'hsl(300, 100%, 50%)',
    text: '', onTextChange: jest.fn(), speed: 100, onSpeedChange: jest.fn(),
    selectedColor: LED_COLORS[0], onColorChange: jest.fn(), showBorder: false,
    onToggleBorder: jest.fn(), isBorderChase: false, onToggleBorderChase: jest.fn(),
    isBorderBlinking: false, onToggleBorderBlinking: jest.fn(), isLandscapeLocked: false,
    onToggleOrientation: jest.fn(), recentMessages: [], favoriteMessages: [],
    onSelectRecentMessage: jest.fn(), onToggleFavorite: jest.fn()
};

describe('DisplayTextSection Component', () => {
    it('devrait afficher les bons états de boutons pour les effets', () => {
        const {getByText} = render(
            <SettingsProvider value={mockContext}>
                <DisplayTextSection/>
            </SettingsProvider>
        );

        expect(getByText('Texte : Clignotant')).toBeTruthy();
        expect(getByText('Direction : Droite vers Gauche')).toBeTruthy();
    });

    it('devrait déclencher onToggleReverseScroll lors du clic sur le bouton direction', () => {
        const {getByTestId} = render(
            <SettingsProvider value={mockContext}>
                <DisplayTextSection/>
            </SettingsProvider>
        );

        const btn = getByTestId('direction-button');
        fireEvent.press(btn);

        expect(mockContext.onToggleReverseScroll).toHaveBeenCalledTimes(1);
    });
});
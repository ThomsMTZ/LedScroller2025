import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {LED_COLORS} from "../../components";
import {SettingsProvider} from "../../context/SettingsContext";
import {SpeedSection} from "../../components/SettingsModal/components/SpeedSection";

const mockContext = {
    speed: 120,
    onSpeedChange: jest.fn(),
    currentHsl: 'hsl(210, 100%, 50%)',
    text: '', onTextChange: jest.fn(), selectedColor: LED_COLORS[0], onColorChange: jest.fn(),
    showBorder: false, onToggleBorder: jest.fn(), isBorderChase: false, onToggleBorderChase: jest.fn(),
    isBorderBlinking: false, onToggleBorderBlinking: jest.fn(), isLandscapeLocked: false,
    onToggleOrientation: jest.fn(), isTextBlinking: false, onToggleTextBlinking: jest.fn(),
    isReverseScroll: false, onToggleReverseScroll: jest.fn(), recentMessages: [], favoriteMessages: [],
    onSelectRecentMessage: jest.fn(), onToggleFavorite: jest.fn()
};

describe('SpeedSection Component', () => {
    it('devrait initialiser le Slider avec la bonne valeur de vitesse', () => {
        const {getByTestId} = render(
            <SettingsProvider value={mockContext}>
                <SpeedSection/>
            </SettingsProvider>
        );

        const slider = getByTestId('speed-slider');
        fireEvent(slider, 'onSlidingComplete', 240);
        expect(mockContext.onSpeedChange).toHaveBeenCalledWith(240);
    });
});
import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {TouchableOpacity} from 'react-native';
import {SettingsProvider} from "../../context/SettingsContext";
import ColorSection from "../../components/SettingsModal/components/ColorSection";
import {LED_COLORS} from "../../components";

const mockContext = {
    selectedColor: LED_COLORS[0],
    onColorChange: jest.fn(),
    currentHsl: 'hsl(0, 100%, 50%)',
    text: '',
    onTextChange: jest.fn(),
    speed: 100,
    onSpeedChange: jest.fn(),
    showBorder: false,
    onToggleBorder: jest.fn(),
    isBorderChase: false,
    onToggleBorderChase: jest.fn(),
    isBorderBlinking: false,
    onToggleBorderBlinking: jest.fn(),
    isLandscapeLocked: false,
    onToggleOrientation: jest.fn(),
    isTextBlinking: false,
    onToggleTextBlinking: jest.fn(),
    isReverseScroll: false,
    onToggleReverseScroll: jest.fn(),
    recentMessages: [],
    favoriteMessages: [],
    onSelectRecentMessage: jest.fn(),
    onToggleFavorite: jest.fn()
};

describe('ColorSection Component', () => {
    it('devrait rendre toutes les billes de couleur disponibles', () => {
        const {UNSAFE_getAllByType} = render(
            <SettingsProvider value={mockContext}>
                <ColorSection/>
            </SettingsProvider>
        );

        const touchables = UNSAFE_getAllByType(TouchableOpacity);

        fireEvent.press(touchables[1]);

        expect(mockContext.onColorChange).toHaveBeenCalledWith(LED_COLORS[1]);
    });
});
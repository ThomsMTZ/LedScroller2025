import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {SettingsProvider} from "../../../context/SettingsContext";
import {MessageSection} from "../../../components/SettingsModal/components/MessageSection";
import {LED_COLORS} from "../../../components";

const mockContextBase = {
    text: '',
    onTextChange: jest.fn(),
    currentHsl: 'hsl(0, 100%, 50%)',
    recentMessages: [],
    favoriteMessages: [],
    onSelectRecentMessage: jest.fn(),
    onToggleFavorite: jest.fn(),
    speed: 100, onSpeedChange: jest.fn(), selectedColor: LED_COLORS[0], onColorChange: jest.fn(),
    showBorder: false, onToggleBorder: jest.fn(), isBorderChase: false, onToggleBorderChase: jest.fn(),
    isBorderBlinking: false, onToggleBorderBlinking: jest.fn(), isLandscapeLocked: false,
    onToggleOrientation: jest.fn(), isTextBlinking: false, onToggleTextBlinking: jest.fn(),
    isReverseScroll: false, onToggleReverseScroll: jest.fn()
};

describe('MessageSection Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait appeler onTextChange lors de la saisie au clavier', () => {
        const {getByPlaceholderText} = render(
            <SettingsProvider value={mockContextBase}>
                <MessageSection/>
            </SettingsProvider>
        );

        const input = getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(input, 'Alivio');

        expect(mockContextBase.onTextChange).toHaveBeenCalledWith('Alivio');
    });

    it('devrait afficher l’historique et réagir au clic sur un message récent', () => {
        const contextWithHistory = {
            ...mockContextBase,
            recentMessages: ['Bucharest', 'Marseille']
        };

        const {getByTestId} = render(
            <SettingsProvider value={contextWithHistory}>
                <MessageSection/>
            </SettingsProvider>
        );

        const chip = getByTestId('history-chip-Bucharest');
        fireEvent.press(chip);

        expect(mockContextBase.onSelectRecentMessage).toHaveBeenCalledWith('Bucharest');
    });
});
import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {LED_COLORS, SettingsModal} from "../../components";
import {SettingsModalProps} from "../../components/SettingsModal/types";
import {useSettings} from "../../context/SettingsContext";

jest.mock('../../context/SettingsContext', () => ({
    useSettings: jest.fn()
}));

const defaultProps: SettingsModalProps = {
    fontSize: 200,
    maxFontSize: 400,
    minFontSize: 20,
    onFontSizeChange: jest.fn(),
    onFontSizeChangeEnd: jest.fn(),
};

const mockSettings = {
    isSettingsOpen: true,
    onCloseSettings: jest.fn(),
    text: 'Alivio',
    onTextChange: jest.fn(),
    speed: 120,
    onSpeedChange: jest.fn(),
    selectedColor: LED_COLORS[0],
    onColorChange: jest.fn(),
    borderColor: LED_COLORS[0],
    onBorderColorChange: jest.fn(),

    showBorder: true,
    onToggleBorder: jest.fn(),
    isBorderChase: true,
    onToggleBorderChase: jest.fn(),
    isBorderBlinking: false,
    onToggleBorderBlinking: jest.fn(),

    isLandscapeLocked: false,
    onToggleOrientation: jest.fn(),

    isTextBlinking: false,
    onToggleTextBlinking: jest.fn(),
    isReverseScroll: false,
    onToggleReverseScroll: jest.fn(),

    recentMessages: ['Hello', 'World'],
    favoriteMessages: ['Marseille'],
    onSelectRecentMessage: jest.fn(),
    onToggleFavorite: jest.fn(),
    
    currentHsl: 'hsl(0, 100%, 50%)',
    currentBorderHsl: 'hsl(0, 100%, 50%)',
};

describe('SettingsModal Integration Suite', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useSettings as jest.Mock).mockReturnValue(mockSettings);
    });

    it('devrait orchestrer et afficher correctement toutes ses sous-sections graphiques', () => {
        const {getByPlaceholderText, getByText} = render(
            <SettingsModal {...defaultProps} />
        );

        // MessageSection est ouverte par défaut
        expect(getByPlaceholderText('Entrez votre message...')).toBeTruthy();
        expect(getByText('⭐ Marseille')).toBeTruthy();
        expect(getByText('Hello')).toBeTruthy();

        // Les titres des accordéons sont visibles
        expect(getByText('🖼️ Cadre LED')).toBeTruthy();
        expect(getByText('⚡ Vitesse')).toBeTruthy();
        expect(getByText('🎨 Couleur')).toBeTruthy();
    });

    it('devrait propager les actions utilisateur', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);

        // Le bouton de fermeture est toujours accessible (dans le header)
        const closeButton = getByTestId('close-modal-button');
        fireEvent.press(closeButton);

        expect(mockSettings.onCloseSettings).toHaveBeenCalledTimes(1);
    });

    it('devrait réagir correctement aux comportements conditionnels (Arbre de rendu)', () => {
        (useSettings as jest.Mock).mockReturnValue({
            ...mockSettings,
            showBorder: false,
        });

        // Les boutons de style de bordure ne sont pas rendus même en ouvrant la section
        const {queryByTestId} = render(<SettingsModal {...defaultProps} />);

        expect(queryByTestId('chase-border-button')).toBeNull();
        expect(queryByTestId('blink-border-button')).toBeNull();
    });

    it('devrait déclencher la fermeture de l’UI lors de l’appui sur la croix', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);

        const closeButton = getByTestId('close-modal-button');
        fireEvent.press(closeButton);

        expect(mockSettings.onCloseSettings).toHaveBeenCalledTimes(1);
    });
});
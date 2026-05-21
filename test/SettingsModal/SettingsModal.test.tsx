import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {LED_COLORS, SettingsModal} from "../../components";
import {SettingsModalProps} from "../../components/SettingsModal/types";

const defaultProps: SettingsModalProps = {
    visible: true,
    onClose: jest.fn(),
    text: 'Alivio',
    onTextChange: jest.fn(),
    speed: 120,
    onSpeedChange: jest.fn(),
    selectedColor: LED_COLORS[0],
    onColorChange: jest.fn(),

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
};

describe('SettingsModal Integration Suite', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait orchestrer et afficher correctement toutes ses sous-sections graphiques', () => {
        const {getByPlaceholderText, getByText, getByTestId} = render(
            <SettingsModal {...defaultProps} />
        );

        expect(getByPlaceholderText('Entrez votre message...')).toBeTruthy();
        expect(getByText('⭐ Marseille')).toBeTruthy();
        expect(getByText('Hello')).toBeTruthy();

        expect(getByTestId('border-button')).toBeTruthy();
        expect(getByTestId('orientation-button')).toBeTruthy();
        expect(getByTestId('speed-slider')).toBeTruthy();
    });

    it('devrait propager les actions utilisateur', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);

        const borderButton = getByTestId('border-button');
        fireEvent.press(borderButton);

        expect(defaultProps.onToggleBorder).toHaveBeenCalledTimes(1);
    });

    it('devrait réagir correctement aux comportements conditionnels (Arbre de rendu)', () => {
        const propsWithoutBorder: SettingsModalProps = {
            ...defaultProps,
            showBorder: false,
        };

        const {queryByTestId} = render(<SettingsModal {...propsWithoutBorder} />);

        expect(queryByTestId('chase-border-button')).toBeNull();
        expect(queryByTestId('blink-border-button')).toBeNull();
    });

    it('devrait déclencher la fermeture de l’UI lors de l’appui sur la croix', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);

        const closeButton = getByTestId('close-modal-button');
        fireEvent.press(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
});
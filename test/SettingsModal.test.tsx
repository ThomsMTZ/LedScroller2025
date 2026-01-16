import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {LED_COLORS, SettingsModal} from '../components';
import {StyleSheet} from 'react-native';

jest.mock('@expo/vector-icons', () => ({Ionicons: 'Ionicons'}));
jest.mock('@react-native-community/slider', () => 'Slider');

describe('<SettingsModal /> UI Completeness', () => {
    const defaultProps = {
        visible: true,
        onClose: jest.fn(),
        text: 'TEST',
        onTextChange: jest.fn(),
        speed: 100,
        onSpeedChange: jest.fn(),
        selectedColor: LED_COLORS[0],
        onColorChange: jest.fn(),
        isLandscapeLocked: false,
        onToggleOrientation: jest.fn(),
        showBorder: true,
        onToggleBorder: jest.fn(),
        isTextBlinking: false,
        onToggleTextBlinking: jest.fn(),
        isBorderBlinking: false,
        onToggleBorderBlinking: jest.fn(),
    };

    it('contient toutes les sections de configuration', () => {
        const {getByText} = render(<SettingsModal {...defaultProps} />);

        expect(getByText('💬 Message')).toBeTruthy();
        expect(getByText('⚡ Vitesse')).toBeTruthy();
        expect(getByText('🔄 Orientation')).toBeTruthy();
        expect(getByText('🖼️ Cadre LED')).toBeTruthy();
        expect(getByText('🎨 Couleur')).toBeTruthy();

        expect(getByText('✨ Effets')).toBeTruthy();
    });

    it('affiche les indicateurs visuels corrects', () => {
        const {getByText} = render(<SettingsModal {...defaultProps} />);

        expect(getByText('Lent')).toBeTruthy();
        expect(getByText('Rapide')).toBeTruthy();
        expect(getByText('Rotation Automatique')).toBeTruthy();
        expect(getByText('Bordure affichée')).toBeTruthy();

        // VÉRIFICATION : Textes par défaut des nouveaux boutons
        expect(getByText('Texte : Fixe')).toBeTruthy();
        expect(getByText('Bordure : Fixe')).toBeTruthy();
    });

    it('change le texte du bouton orientation quand verrouillé', () => {
        const {getByText} = render(
            <SettingsModal {...defaultProps} isLandscapeLocked={true}/>
        );
        expect(getByText('Mode Paysage Forcé')).toBeTruthy();
    });

    it('appelle onToggleTextBlinking au clic', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);

        const blinkTextBtn = getByTestId('blink-text-button');
        fireEvent.press(blinkTextBtn);

        expect(defaultProps.onToggleTextBlinking).toHaveBeenCalled();
    });

    it('appelle onToggleBorderBlinking au clic', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);

        const blinkBorderBtn = getByTestId('blink-border-button');
        fireEvent.press(blinkBorderBtn);

        expect(defaultProps.onToggleBorderBlinking).toHaveBeenCalled();
    });

    it('affiche l\'état activé pour les effets', () => {
        const {getByText} = render(
            <SettingsModal
                {...defaultProps}
                isTextBlinking={true}
                isBorderBlinking={true}
            />
        );

        expect(getByText('Texte : Clignotant')).toBeTruthy();
        expect(getByText('Bordure : Clignotante')).toBeTruthy();
    });

    it('appelle onTextChange quand l\'utilisateur tape du texte', () => {
        const {getByPlaceholderText} = render(<SettingsModal {...defaultProps} />);

        const textInput = getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(textInput, 'NOUVEAU TEXTE');

        expect(defaultProps.onTextChange).toHaveBeenCalledWith('NOUVEAU TEXTE');
    });

    it('appelle onToggleOrientation au clic sur le bouton orientation', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);

        const orientationButton = getByTestId('orientation-button');
        fireEvent.press(orientationButton);

        expect(defaultProps.onToggleOrientation).toHaveBeenCalled();
    });

    it('appelle onToggleBorder au clic sur le bouton bordure', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);

        const borderButton = getByTestId('border-button');
        fireEvent.press(borderButton);

        expect(defaultProps.onToggleBorder).toHaveBeenCalled();
    });

    it('appelle onClose quand on clique sur le bouton fermer', () => {
        const {getByRole} = render(<SettingsModal {...defaultProps} />);

        const closeButton = getByRole('button', {name: /fermer/i});
        fireEvent.press(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('appelle onClose quand on clique en dehors du modal', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} />);
        const overlay = getByTestId('modal-overlay');

        fireEvent.press(overlay);

        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('utilise la couleur HSL sélectionnée pour les styles actifs', () => {
        const customColor = {hue: 120, saturation: 100, lightness: 50, name: 'Vert'};
        const {getByTestId} = render(
            <SettingsModal
                {...defaultProps}
                selectedColor={customColor}
                isLandscapeLocked={true}
            />
        );
        const orientationButton = getByTestId('orientation-button');

        const flatStyle = StyleSheet.flatten(orientationButton.props.style);

        expect(flatStyle.borderColor).toBe('hsl(120, 100%, 50%)');
    });

    it('n\'affiche pas le modal quand visible est false', () => {
        const {queryByText} = render(
            <SettingsModal {...defaultProps} visible={false}/>
        );

        expect(queryByText('⚙️ Config')).toBeNull();
    });

    it('affiche les icônes correctes selon l\'état des toggles', () => {
        const {getByTestId} = render(
            <SettingsModal {...defaultProps} isLandscapeLocked={true} showBorder={false}/>
        );

        const lockIcon = getByTestId('orientation-icon');
        const borderIcon = getByTestId('border-icon');

        expect(lockIcon.props.name).toBe('lock-closed');
        expect(borderIcon.props.name).toBe('scan-outline');
    });

    it('gère les valeurs extrêmes de vitesse', () => {
        const {getByTestId} = render(<SettingsModal {...defaultProps} speed={800}/>);

        const slider = getByTestId('speed-slider');
        expect(slider.props.value).toBe(800);
        expect(slider.props.maximumValue).toBe(800);
    });

});
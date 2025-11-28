/* eslint-disable import/prefer-default-export */
import {TextStyle, ViewStyle} from 'react-native';

// Interface pour les props du composant LedScroller
export interface LedScrollerProps {
    initialText?: string;
}

// Interface pour typer strictement les styles
export interface Styles {
    container: ViewStyle;
    interactiveArea: ViewStyle;
    scroller: ViewStyle;
    textBase: TextStyle;
    gridOverlay: ViewStyle;
    hintContainer: ViewStyle;
    hintText: TextStyle;
    modalOverlay: ViewStyle;
    modalContent: ViewStyle;
    headerModal: ViewStyle;
    modalTitle: TextStyle;
    input: TextStyle;
    label: TextStyle;
    colorRow: ViewStyle;
    colorDot: ViewStyle;
}

// Interface pour les props du SettingsModal
export interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    text: string;
    onTextChange: (text: string) => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
    hue: number;
    onHueChange: (hue: number) => void;
}

// Interface pour les props du ColorSelector
export interface ColorSelectorProps {
    selectedHue: number;
    onHueChange: (hue: number) => void;
}

// Interface pour les props du HintContainer
export interface HintContainerProps {
    text?: string;
}

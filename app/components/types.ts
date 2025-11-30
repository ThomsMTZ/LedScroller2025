import {TextStyle, ViewStyle} from 'react-native';

// Interface pour les props du composant LedScroller
export interface LedScrollerProps {
    initialText?: string;
}

// Interface pour typer strictement les styles
export interface Styles {
    container: ViewStyle;
    gradientBackground: ViewStyle;
    header: ViewStyle;
    headerTitle: TextStyle;
    headerSubtitle: TextStyle;
    settingsButton: ViewStyle;
    interactiveArea: ViewStyle;
    ledDisplay: ViewStyle;
    ledBorder: ViewStyle;
    scroller: ViewStyle;
    textBase: TextStyle;
    gridOverlay: ViewStyle;
    hintContainer: ViewStyle;
    hintText: TextStyle;
    hintIcon: ViewStyle;
    modalOverlay: ViewStyle;
    modalContent: ViewStyle;
    modalHandle: ViewStyle;
    headerModal: ViewStyle;
    modalTitle: TextStyle;
    closeButton: ViewStyle;
    section: ViewStyle;
    input: TextStyle;
    label: TextStyle;
    colorGrid: ViewStyle;
    colorButton: ViewStyle;
    colorButtonSelected: ViewStyle;
    colorDot: ViewStyle;
    sliderContainer: ViewStyle;
    sliderLabels: ViewStyle;
    sliderLabel: TextStyle;
    footer: ViewStyle;
    footerText: TextStyle;
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

import {TextStyle, ViewStyle} from 'react-native';

export interface LedColorType {
    hue: number;
    saturation: number;
    lightness: number;
    name: string;
}

export interface LedScrollerProps {
    initialText?: string;
}

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

export interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    text: string;
    onTextChange: (text: string) => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
    selectedColor: LedColorType;
    onColorChange: (color: LedColorType) => void;
    isLandscapeLocked: boolean;
    onToggleOrientation: () => void;
    showBorder: boolean;
    onToggleBorder: () => void;
}

export interface ColorSelectorProps {
    selectedColor: LedColorType;
    onColorChange: (color: LedColorType) => void;
}

/* eslint-disable import/prefer-default-export */
import {TextStyle, ViewStyle} from 'react-native';

export interface LedScrollerProps {
    initialText?: string;
}

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

export interface ColorSelectorProps {
    selectedHue: number;
    onHueChange: (hue: number) => void;
}

export interface HintContainerProps {
    text?: string;
}

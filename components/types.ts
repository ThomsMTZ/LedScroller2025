export interface LedColorType {
    hue: number;
    saturation: number;
    lightness: number;
    name: string;
}

export interface LedScrollerProps {
    initialText?: string;
}

export interface SettingsState {
    text: string;
    speed: number;
    selectedColor: LedColorType;
    borderColor: LedColorType;
    showBorder: boolean;
    isBorderChase: boolean;
    isBorderBlinking: boolean;
    isTextBlinking: boolean;
    isReverseScroll: boolean;
    thickness: number;
}

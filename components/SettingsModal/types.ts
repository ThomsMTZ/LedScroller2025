import {LedColorType} from "../types";

export interface SettingsModalProps {
    fontSize: number;
    maxFontSize: number;
    minFontSize: number;
    onFontSizeChange: (fontSize: number) => void;
    onFontSizeChangeEnd: (fontSize: number) => void;
}


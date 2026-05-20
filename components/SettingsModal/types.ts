import {LedColorType} from "../types";

export interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    text: string;
    onTextChange: (text: string) => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
    selectedColor: LedColorType;
    onColorChange: (color: LedColorType) => void;

    // --- BORDURE ---
    showBorder: boolean;
    onToggleBorder: () => void;
    isBorderChase: boolean;
    onToggleBorderChase: () => void;
    isBorderBlinking: boolean;
    onToggleBorderBlinking: () => void;

    // --- ORIENTATION & DIRECTION ---
    isLandscapeLocked: boolean;
    onToggleOrientation: () => void;

    // --- TEXTE ---
    isTextBlinking: boolean;
    onToggleTextBlinking: () => void;
    isReverseScroll: boolean;
    onToggleReverseScroll: () => void;

    // --- HISTORIQUE & FAVORIS ---
    recentMessages: string[];
    favoriteMessages: string[];
    onSelectRecentMessage: (msg: string) => void;
    onToggleFavorite: (msg: string) => void;
}


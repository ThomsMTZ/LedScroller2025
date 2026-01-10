// Modern 2025 color palette
import {LedColorType} from "./types";

export const COLORS = {
    background: ['#0a0a0a', '#1a1a2e', '#16213e'] as const,
    accent: '#00d4ff',
    surface: 'rgba(30, 30, 50, 0.8)',
    surfaceLight: 'rgba(255, 255, 255, 0.05)',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
};

// Expanded color presets for LED
export const LED_COLORS: LedColorType[] = [
    {hue: 0, saturation: 100, lightness: 50, name: 'Rouge'},
    {hue: 30, saturation: 100, lightness: 50, name: 'Orange'},
    {hue: 60, saturation: 100, lightness: 50, name: 'Jaune'},
    {hue: 120, saturation: 100, lightness: 50, name: 'Vert'},
    {hue: 180, saturation: 100, lightness: 50, name: 'Cyan'},
    {hue: 210, saturation: 100, lightness: 50, name: 'Bleu'},
    {hue: 270, saturation: 100, lightness: 50, name: 'Violet'},
    {hue: 300, saturation: 100, lightness: 50, name: 'Magenta'},
    {hue: 330, saturation: 100, lightness: 50, name: 'Rose'},
    {hue: 0, saturation: 0, lightness: 100, name: 'Blanc'},
];

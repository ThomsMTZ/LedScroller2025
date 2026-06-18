import {LedColorType} from "./types";

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

export const COLORS = {
    background: ['#0a0a0a', '#1a1a2e', '#16213e'] as const,
    accent: '#00d4ff',
    surface: 'rgba(30, 30, 50, 0.8)',
    surfaceLight: 'rgba(255, 255, 255, 0.05)',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
};

export const ANIMATION_DURATIONS = {
    /** Transition douce lors d'un changement de couleur LED */
    colorTransition: 500,
    /** Durée d'un demi-cycle de clignotement (fade-out ou fade-in) */
    blinkStep: 500,
    /** Transition pour stopper le clignotement (retour à opacité 1) */
    blinkStop: 300,
    /** Ajustement de la taille de police lors d'un changement d'orientation */
    fontSizeAdjust: 300,
    /** Durée minimale de l'animation chase border en ms */
    chaseMin: 300,
    /** Multiplicateur pour calculer la durée de l'animation chase depuis la vitesse */
    chaseSpeedMultiplier: 300_000,
    /** Délai de debounce avant sauvegarde des settings en AsyncStorage */
    settingsSaveDebounce: 1_000,
} as const;


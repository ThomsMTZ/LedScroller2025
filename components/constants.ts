// Modern 2025 color palette
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
export const LED_COLORS = [
    {hue: 0, name: 'Rouge'},      // Red
    {hue: 30, name: 'Orange'},    // Orange
    {hue: 60, name: 'Jaune'},     // Yellow
    {hue: 120, name: 'Vert'},     // Green
    {hue: 180, name: 'Cyan'},     // Cyan
    {hue: 210, name: 'Bleu'},     // Blue
    {hue: 270, name: 'Violet'},   // Purple
    {hue: 300, name: 'Magenta'},  // Magenta
    {hue: 330, name: 'Rose'},     // Pink
];

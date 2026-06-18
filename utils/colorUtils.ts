/**
 * Construit une chaîne de couleur CSS HSL.
 * Déclarée comme worklet pour être exécutable sur le thread UI de Reanimated.
 */
export function buildHslString(h: number, s: number, l: number): string {
    'worklet';
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

/**
 * Construit une chaîne de couleur CSS HSLA (avec canal alpha).
 * Déclarée comme worklet pour être exécutable sur le thread UI de Reanimated.
 */
export function buildHslaString(h: number, s: number, l: number, a: number): string {
    'worklet';
    return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a})`;
}

import {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';

interface LedLayoutOptions {
    text: string;
    isLandscape: boolean;
}

/**
 * Responsabilité unique : calculer les dimensions et la configuration
 * du panneau LED en fonction de l'orientation et du texte.
 * Aucune animation, aucun geste ici.
 */
export const useLedLayout = ({text, isLandscape}: LedLayoutOptions) => {
    const {width, height} = useWindowDimensions();
    const [textWidth, setTextWidth] = useState<number>(0);

    // Réinitialise la mesure quand le texte change pour forcer un re-mesurage
    // au fontSize courant (évite les valeurs périmées)
    useEffect(() => {
        setTextWidth(0);
    }, [text]);

    const PORTRAIT_PANEL_HEIGHT = width * 0.6;
    const LOOP_SPACING = width * 0.3;
    const patternWidth = textWidth + LOOP_SPACING;

    const copiesNeeded = textWidth > 0
        ? Math.ceil(width / patternWidth) + 1
        : 2;
    const copiesArray = Array.from({length: Math.max(2, copiesNeeded)});

    const baseMaxFontSize = isLandscape ? height * 0.8 : PORTRAIT_PANEL_HEIGHT * 0.8;
    const MIN_FONT_SIZE = 20;

    // Compte les caractères visuels réels (chaque emoji = 1 char, pas 2 code units UTF-16)
    const visualLength = [...text].length;

    // Plafond basé sur la hauteur du panneau
    const maxByHeight = visualLength > 4
        ? baseMaxFontSize * (4 / visualLength)
        : baseMaxFontSize;

    // Plafond basé sur la largeur du panneau : les emojis sont quasi-carrés (≈ 1.2× fontSize de large),
    // ce qui évite que N emojis côte à côte dépassent la largeur visible simultanément
    const panelWidth = width - 32; // paddingHorizontal: 16 × 2
    const maxByWidth = visualLength > 0
        ? panelWidth / (visualLength * 1.2)
        : baseMaxFontSize;

    const maxFontSize = Math.max(Math.min(maxByHeight, maxByWidth), MIN_FONT_SIZE);

    return {
        width,
        textWidth,
        setTextWidth,
        PORTRAIT_PANEL_HEIGHT,
        LOOP_SPACING,
        patternWidth,
        copiesArray,
        maxFontSize,
        MIN_FONT_SIZE,
    };
};

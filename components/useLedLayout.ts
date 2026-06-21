import {useState} from 'react';
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

    const PORTRAIT_PANEL_HEIGHT = width * 0.6;
    const LOOP_SPACING = width * 0.3;
    const patternWidth = textWidth + LOOP_SPACING;

    const copiesNeeded = textWidth > 0
        ? Math.ceil(width / patternWidth) + 1
        : 2;
    const copiesArray = Array.from({length: Math.max(2, copiesNeeded)});

    const baseMaxFontSize = isLandscape ? height * 0.8 : PORTRAIT_PANEL_HEIGHT * 0.8;
    const MIN_FONT_SIZE = 20;
    const calculatedMaxFontSize = text.length > 6
        ? baseMaxFontSize * (6 / text.length)
        : baseMaxFontSize;
    const maxFontSize = Math.max(calculatedMaxFontSize, MIN_FONT_SIZE);

    return {
        width,
        textWidth,
        PORTRAIT_PANEL_HEIGHT,
        LOOP_SPACING,
        patternWidth,
        copiesArray,
        maxFontSize,
        MIN_FONT_SIZE,
        setTextWidth,
    };
};

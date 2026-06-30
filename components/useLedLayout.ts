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

    // Compte les caractères visuels réels (chaque emoji = 1 char, pas 2 code units UTF-16)
    const visualLength = [...text].length;

    // Plafond basé sur la hauteur du panneau uniquement.
    // Pas de plafond basé sur la largeur : c'est un scroller, le texte n'a pas besoin
    // de tenir dans la largeur de l'écran — il défile. Un plafond largeur écrasait
    // injustement maxFontSize dès que le texte contenait 2+ emojis.
    const maxFontSize = Math.max(
        visualLength > 4
            ? baseMaxFontSize * (4 / visualLength)
            : baseMaxFontSize,
        MIN_FONT_SIZE
    );

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

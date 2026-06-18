import React, {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {
    cancelAnimation,
    Easing,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import {Gesture} from 'react-native-gesture-handler';
import {LedColorType} from './types';
import {ANIMATION_DURATIONS} from './constants';
import {buildHslString, buildHslaString} from '../utils/colorUtils';

interface LedAnimationProps {
    text: string;
    speed: number;
    isReverseScroll: boolean;
    isTextBlinking: boolean;
    isBorderBlinking: boolean;
    selectedColor: LedColorType;
    isLandscape: boolean;
    onDoubleTap: () => void;
}

export const useLedAnimation = ({
                                    text,
                                    speed,
                                    isReverseScroll,
                                    isTextBlinking,
                                    isBorderBlinking,
                                    selectedColor,
                                    isLandscape,
                                    onDoubleTap,
                                }: LedAnimationProps) => {
    const componentId = React.useId();
    const {width, height} = useWindowDimensions();

    // --- Shared values ---
    const translateX: SharedValue<number> = useSharedValue(width);
    const fontSize: SharedValue<number> = useSharedValue(100);
    const savedFontSize: SharedValue<number> = useSharedValue(100);
    const textBlinkOpacity: SharedValue<number> = useSharedValue(1);
    const borderBlinkOpacity: SharedValue<number> = useSharedValue(1);
    const hueVal: SharedValue<number> = useSharedValue(selectedColor.hue);
    const satVal: SharedValue<number> = useSharedValue(selectedColor.saturation);
    const ligVal: SharedValue<number> = useSharedValue(selectedColor.lightness);

    // --- textWidth géré en state React (comme l'original) ---
    const [textWidth, setTextWidth] = useState<number>(0);

    const PORTRAIT_PANEL_HEIGHT = width * 0.6;
    const LOOP_SPACING = width * 0.3;
    const patternWidth = textWidth + LOOP_SPACING;
    const copiesNeeded = textWidth > 0
        ? Math.ceil(width / patternWidth) + 1
        : 2;
    const finalRepetitions = Math.max(2, copiesNeeded);
    const copiesArray = Array.from({length: finalRepetitions});

    // --- Transition couleur ---
    useEffect(() => {
        hueVal.value = withTiming(selectedColor.hue, {duration: ANIMATION_DURATIONS.colorTransition});
        satVal.value = withTiming(selectedColor.saturation, {duration: ANIMATION_DURATIONS.colorTransition});
        ligVal.value = withTiming(selectedColor.lightness, {duration: ANIMATION_DURATIONS.colorTransition});
    }, [selectedColor, hueVal, satVal, ligVal]);

    // --- Helper : applique ou stoppe l'animation de clignotement sur une SharedValue ---
    const applyBlink = (enabled: boolean, sv: SharedValue<number>) => {
        if (enabled) {
            sv.value = withRepeat(
                withSequence(
                    withTiming(0.4, {duration: ANIMATION_DURATIONS.blinkStep}),
                    withTiming(1, {duration: ANIMATION_DURATIONS.blinkStep})
                ),
                -1,
                true
            );
        } else {
            sv.value = withTiming(1, {duration: ANIMATION_DURATIONS.blinkStop});
        }
    };

    // --- Clignotement texte ---
    useEffect(() => {
        applyBlink(isTextBlinking, textBlinkOpacity);
        return () => cancelAnimation(textBlinkOpacity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTextBlinking, textBlinkOpacity]);

    // --- Clignotement bordure ---
    useEffect(() => {
        applyBlink(isBorderBlinking, borderBlinkOpacity);
        return () => cancelAnimation(borderBlinkOpacity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBorderBlinking, borderBlinkOpacity]);

    // --- Animation de scroll ---
    useEffect(() => {
        if (textWidth > 0) {
            cancelAnimation(translateX);
            const safeSpeed = speed > 0 ? speed : 1;
            const linearDuration = (patternWidth / safeSpeed) * 1000;

            if (isReverseScroll) {
                translateX.value = -patternWidth;
                translateX.value = withRepeat(
                    withTiming(0, {duration: linearDuration, easing: Easing.linear}),
                    -1,
                    false
                );
            } else {
                translateX.value = 0;
                translateX.value = withRepeat(
                    withTiming(-patternWidth, {duration: linearDuration, easing: Easing.linear}),
                    -1,
                    false
                );
            }
        }
        return () => cancelAnimation(translateX);
    }, [textWidth, speed, width, patternWidth, isReverseScroll, translateX]);

    // --- Calcul taille de police max ---
    const baseMaxFontSize = isLandscape ? height * 0.8 : PORTRAIT_PANEL_HEIGHT * 0.8;
    const minFontSizeValue = 20;
    const calculatedMaxFontSize = text.length > 6
        ? baseMaxFontSize * (6 / text.length)
        : baseMaxFontSize;
    const maxFontSizeValue = Math.max(calculatedMaxFontSize, minFontSizeValue);

    // --- Ajustement de la taille de la police au changement d'orientation ---
    useEffect(() => {
        if (fontSize.value > maxFontSizeValue) {
            fontSize.value = withTiming(maxFontSizeValue, {duration: ANIMATION_DURATIONS.fontSizeAdjust});
            savedFontSize.value = maxFontSizeValue;
        }
    }, [isLandscape, maxFontSizeValue, fontSize, savedFontSize]);

    // --- Gestures ---
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            const newSize = savedFontSize.value * e.scale;
            fontSize.value = Math.min(Math.max(newSize, minFontSizeValue), maxFontSizeValue);
        })
        .onEnd(() => {
            savedFontSize.value = fontSize.value;
        });

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .runOnJS(true)
        .onEnd(() => {
            onDoubleTap();
        });

    const composedGestures = Gesture.Race(pinchGesture, doubleTapGesture);

    // --- Styles animés ---
    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
    }));

    const animatedTextStyle = useAnimatedStyle(() => {
        const hslColor = buildHslString(hueVal.value, satVal.value, ligVal.value);
        return {
            fontFamily: 'LedFont',
            fontSize: fontSize.value,
            color: hslColor,
            textShadowColor: hslColor,
            textShadowRadius: 20,
            textShadowOffset: {width: 0, height: 0},
            opacity: isTextBlinking ? textBlinkOpacity.value : 1,
        };
    });

    const animatedBorderOpacityStyle = useAnimatedStyle(() => ({
        opacity: isBorderBlinking ? borderBlinkOpacity.value : 1,
    }));

    const animatedBorderColorStyle = useAnimatedStyle(() => {
        const alpha = isBorderBlinking ? borderBlinkOpacity.value : 1;
        return {
            borderColor: buildHslaString(hueVal.value, satVal.value, ligVal.value, alpha),
        };
    });

    const animatedShadowColorStyle = useAnimatedStyle(() => {
        const alpha = isBorderBlinking ? borderBlinkOpacity.value : 1;
        return {
            shadowColor: buildHslaString(hueVal.value, satVal.value, ligVal.value, alpha),
        };
    });

    return {
        // Données de layout
        componentId,
        setTextWidth,
        copiesArray,
        LOOP_SPACING,
        PORTRAIT_PANEL_HEIGHT,

        // Shared values exposées pour LedBorder
        hueVal,
        satVal,
        ligVal,

        // Gestures
        composedGestures,

        // Styles animés
        animatedContainerStyle,
        animatedTextStyle,
        animatedBorderOpacityStyle,
        animatedBorderColorStyle,
        animatedShadowColorStyle,

    };
};
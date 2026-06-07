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
    const blinkOpacity: SharedValue<number> = useSharedValue(1);
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
        hueVal.value = withTiming(selectedColor.hue, {duration: 500});
        satVal.value = withTiming(selectedColor.saturation, {duration: 500});
        ligVal.value = withTiming(selectedColor.lightness, {duration: 500});
    }, [selectedColor, hueVal, satVal, ligVal]);

    // --- Clignotement (texte ET bordure) ---
    useEffect(() => {
        if (isTextBlinking || isBorderBlinking) {
            blinkOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.4, {duration: 500}),
                    withTiming(1, {duration: 500})
                ),
                -1,
                true
            );
        } else {
            blinkOpacity.value = withTiming(1, {duration: 300});
        }
        return () => cancelAnimation(blinkOpacity);
    }, [isTextBlinking, isBorderBlinking, blinkOpacity]);

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
        const h = Math.round(hueVal.value);
        const s = Math.round(satVal.value);
        const l = Math.round(ligVal.value);
        const hslColor = `hsl(${h}, ${s}%, ${l}%)`;
        return {
            fontFamily: 'LedFont',
            fontSize: fontSize.value,
            color: hslColor,
            textShadowColor: hslColor,
            textShadowRadius: 20,
            textShadowOffset: {width: 0, height: 0},
            opacity: isTextBlinking ? blinkOpacity.value : 1,
        };
    });

    const animatedBorderOpacityStyle = useAnimatedStyle(() => ({
        opacity: isBorderBlinking ? blinkOpacity.value : 1,
    }));

    const animatedBorderColorStyle = useAnimatedStyle(() => {
        const h = Math.round(hueVal.value);
        const s = Math.round(satVal.value);
        const l = Math.round(ligVal.value);
        const alpha = isBorderBlinking ? blinkOpacity.value : 1;
        return {
            borderColor: `hsla(${h}, ${s}%, ${l}%, ${alpha})`,
        };
    });

    const animatedShadowColorStyle = useAnimatedStyle(() => {
        const h = Math.round(hueVal.value);
        const s = Math.round(satVal.value);
        const l = Math.round(ligVal.value);
        const alpha = isBorderBlinking ? blinkOpacity.value : 1;
        return {
            shadowColor: `hsla(${h}, ${s}%, ${l}%, ${alpha})`,
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
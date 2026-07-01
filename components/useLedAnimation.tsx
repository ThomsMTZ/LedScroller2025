import {useEffect, useId, useState} from 'react';
import {
    cancelAnimation,
    Easing,
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import {Gesture} from 'react-native-gesture-handler';
import {LedColorType} from './types';
import {ANIMATION_DURATIONS} from './constants';
import {buildHslString, buildHslaString} from '../utils/colorUtils';
import {useLedLayout} from './useLedLayout';

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
    const componentId = useId();

    // --- Délégation des calculs de layout ---
    const layout = useLedLayout({text, isLandscape});
    const {patternWidth, maxFontSize, MIN_FONT_SIZE, textWidth} = layout;

    // --- Shared values & States ---
    const [fontSizeState, setFontSizeState] = useState<number>(100);
    const translateX: SharedValue<number> = useSharedValue(layout.width);
    const fontSize: SharedValue<number> = useSharedValue(100);
    const savedFontSize: SharedValue<number> = useSharedValue(100);
    const textBlinkOpacity: SharedValue<number> = useSharedValue(1);
    const borderBlinkOpacity: SharedValue<number> = useSharedValue(1);
    const hueVal: SharedValue<number> = useSharedValue(selectedColor.hue);
    const satVal: SharedValue<number> = useSharedValue(selectedColor.saturation);
    const ligVal: SharedValue<number> = useSharedValue(selectedColor.lightness);

    // Couleur HSL dérivée dans un worklet — jamais lue pendant le render React.
    const ledColorShared = useDerivedValue(() =>
        buildHslString(hueVal.value, satVal.value, ligVal.value)
    );

    // --- Transition couleur ---
    useEffect(() => {
        hueVal.value = withTiming(selectedColor.hue, {duration: ANIMATION_DURATIONS.colorTransition});
        satVal.value = withTiming(selectedColor.saturation, {duration: ANIMATION_DURATIONS.colorTransition});
        ligVal.value = withTiming(selectedColor.lightness, {duration: ANIMATION_DURATIONS.colorTransition});
    }, [selectedColor, hueVal, satVal, ligVal]);

    // --- Helper : applique ou stoppe l'animation de clignotement sur une SharedValue ---
    const applyBlink = (enabled: boolean, sv: SharedValue<number>): void => {
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
     
    }, [isTextBlinking, textBlinkOpacity]);

    // --- Clignotement bordure ---
    useEffect(() => {
        applyBlink(isBorderBlinking, borderBlinkOpacity);
        return () => cancelAnimation(borderBlinkOpacity);
     
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
    }, [textWidth, layout.width, speed, patternWidth, isReverseScroll, translateX]);

    // --- Ajustement de la taille de la police au changement d'orientation ---
    useEffect(() => {
        if (fontSize.value > maxFontSize) {
            fontSize.value = withTiming(maxFontSize, {duration: ANIMATION_DURATIONS.fontSizeAdjust});
            savedFontSize.value = maxFontSize;
            setFontSizeState(maxFontSize);
        }
    }, [isLandscape, maxFontSize, fontSize, savedFontSize]);

    // --- Gestures ---
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            const newSize = savedFontSize.value * e.scale;
            fontSize.value = Math.min(Math.max(newSize, MIN_FONT_SIZE), maxFontSize);
        })
        .onEnd(() => {
            savedFontSize.value = fontSize.value;
            runOnJS(setFontSizeState)(fontSize.value);
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
        // Layout (délégué à useLedLayout)
        componentId,
        setTextWidth: layout.setTextWidth,
        copiesArray: layout.copiesArray,
        LOOP_SPACING: layout.LOOP_SPACING,
        PORTRAIT_PANEL_HEIGHT: layout.PORTRAIT_PANEL_HEIGHT,
        textWidth: layout.textWidth,
        maxFontSize: layout.maxFontSize,
        minFontSize: layout.MIN_FONT_SIZE,
        fontSizeState,
        setFontSize: (size: number) => { 
            fontSize.value = size; 
        },
        setFontSizeEnd: (size: number) => {
            savedFontSize.value = size;
            runOnJS(setFontSizeState)(size);
        },

        // Couleur dérivée pour LedBorder (worklet-safe)
        ledColorShared,

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
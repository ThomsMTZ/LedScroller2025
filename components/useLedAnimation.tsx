import {useEffect, useId} from 'react';
import {TextStyle, useWindowDimensions} from 'react-native';
import {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import {Gesture} from 'react-native-gesture-handler';

interface AnimationProps {
    text: string;
    speed: number;
    isReverseScroll: boolean;
    isTextBlinking: boolean;
    currentHsl: string;
    onDoubleTap: () => void;
}

export const useLedAnimations = ({
                                     text,
                                     speed,
                                     isReverseScroll,
                                     isTextBlinking,
                                     currentHsl,
                                     onDoubleTap,
                                 }: AnimationProps) => {
    const componentId = useId();
    const {width: screenWidth} = useWindowDimensions();

    const translateX = useSharedValue(0);
    const blinkOpacity = useSharedValue(1);
    const baseFontSize = useSharedValue(120);
    const scale = useSharedValue(1);

    useEffect(() => {
        translateX.value = 0;
        const duration = Math.max(2000, 120000 / (speed > 0 ? speed : 1));
        const targetValue = isReverseScroll ? screenWidth : -screenWidth;

        translateX.value = withRepeat(
            withTiming(targetValue, {duration, easing: Easing.linear}),
            -1,
            false
        );

        return () => cancelAnimation(translateX);
    }, [text, speed, isReverseScroll, screenWidth]);

    useEffect(() => {
        if (isTextBlinking) {
            blinkOpacity.value = withRepeat(
                withSequence(
                    withTiming(0, {duration: 400, easing: Easing.linear}),
                    withTiming(1, {duration: 400, easing: Easing.linear})
                ),
                -1,
                true
            );
        } else {
            blinkOpacity.value = 1;
        }

        return () => cancelAnimation(blinkOpacity);
    }, [isTextBlinking]);

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .runOnJS(true)
        .onEnd(onDoubleTap);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = event.scale;
        })
        .onEnd(() => {
            baseFontSize.value = Math.max(40, Math.min(250, baseFontSize.value * scale.value));
            scale.value = 1;
        });

    const composedGestures = Gesture.Simultaneous(doubleTapGesture, pinchGesture);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
    }));

    const animatedTextStyle = useAnimatedStyle(() => {
        const liveFontSize = Math.max(40, Math.min(250, baseFontSize.value * scale.value));
        return {
            fontFamily: 'LedFont',
            fontSize: liveFontSize,
            color: currentHsl,
            textShadowColor: currentHsl,
            textShadowRadius: 20,
            textShadowOffset: {width: 0, height: 0},
            opacity: blinkOpacity.value,
        } as TextStyle;
    });

    return {
        componentId,
        composedGestures,
        animatedContainerStyle,
        animatedTextStyle,
    };
};
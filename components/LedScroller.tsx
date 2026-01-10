import React, { useEffect, useState } from 'react';
import { StatusBar, Text, TextStyle, useWindowDimensions, View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureUpdateEvent,
    PinchGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import { styles } from './styles';
import { LedScrollerProps } from './types';
import GridOverlay from './GridOverlay';
import HintContainer from './HintContainer';
import SettingsModal from './SettingsModal';

const LedScroller: React.FC<LedScrollerProps> = ({ initialText = 'BONJOUR 2025' }) => {
    const { width } = useWindowDimensions();

    // 1. STATE
    const [text, setText] = useState<string>(initialText);
    const [hue, setHue] = useState<number>(120);
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(15000);

    // 2. SHARED VALUES
    const translateX: SharedValue<number> = useSharedValue(width);
    const fontSize: SharedValue<number> = useSharedValue(120);
    const savedFontSize: SharedValue<number> = useSharedValue(120);

    // 3. ANIMATION LOOP
    useEffect(() => {
        // Stop ancienne anim
        cancelAnimation(translateX);
        // Reset position de départ
        translateX.value = width;

        // Lance la nouvelle anim immédiatement
        translateX.value = withRepeat(
            withTiming(-width * 4, {
                duration: speed,
                easing: Easing.linear
            }),
            -1,
            false
        );
    }, [text, speed, width]);

    // 4. GESTES
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
            'worklet';
            fontSize.value = savedFontSize.value * e.scale;
        })
        .onEnd(() => {
            'worklet';
            savedFontSize.value = fontSize.value;
        });

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .runOnJS(true) // Thread Switching
        .onEnd(() => {
            setSettingsOpen(true);
        });

    const composedGestures = Gesture.Race(pinchGesture, doubleTapGesture);

    // 5. STYLES
    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            fontSize: fontSize.value,
            color: `hsl(${hue}, 100%, 50%)`,
            textShadowColor: `hsl(${hue}, 100%, 50%)`,
            textShadowRadius: 15
        } as TextStyle;
    });

    // 6. RENDER
    return (
        <View style={styles.container}>
            <StatusBar hidden />

            <GestureDetector gesture={composedGestures}>
                <View style={styles.interactiveArea}>
                    <Animated.View style={[
                        styles.scroller,
                        { minWidth: width * 2 },
                        animatedTextStyle
                    ]}>
                        <Text style={styles.textBase} numberOfLines={1}>
                            {text}
                        </Text>
                    </Animated.View>

                    <GridOverlay />

                </View>
            </GestureDetector>

            <HintContainer />

            <SettingsModal
                visible={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                text={text}
                onTextChange={setText}
                speed={speed}
                onSpeedChange={setSpeed}
                hue={hue}
                onHueChange={setHue}
            />
        </View>
    );
};

export default LedScroller;
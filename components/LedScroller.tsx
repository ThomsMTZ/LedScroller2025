import React, { useEffect, useState } from 'react';
import { StatusBar, useWindowDimensions, View, TextStyle } from 'react-native';
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

    // 1. STATE REACT (Données logiques)
    const [text, setText] = useState<string>(initialText);
    const [hue, setHue] = useState<number>(120); // Vert par défaut
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(10000);

    // 2. SHARED VALUES (Données d'animation UI)
    const translateX: SharedValue<number> = useSharedValue(width);
    const fontSize: SharedValue<number> = useSharedValue(120);
    const savedFontSize: SharedValue<number> = useSharedValue(120);

    const hueVal: SharedValue<number> = useSharedValue(120);

    // 3. SYNCHRONISATION (React -> Reanimated)
    useEffect(() => {
        hueVal.value = withTiming(hue, { duration: 500 });
    }, [hue]);

    // 4. BOUCLE D'ANIMATION (Mouvement)
    useEffect(() => {
        cancelAnimation(translateX);
        translateX.value = width;

        translateX.value = withRepeat(
            withTiming(-width * 4, {
                duration: speed,
                easing: Easing.linear
            }),
            -1,
            false
        );
    }, [text, speed, width]);

    // 5. GESTES (Pinch & Tap)
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
        .runOnJS(true)
        .onEnd(() => {
            setSettingsOpen(true);
        });

    const composedGestures = Gesture.Race(pinchGesture, doubleTapGesture);

    // 6. STYLES ANIMÉS SÉPARÉS
    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    // B. Style pour le TEXTE
    const animatedTextStyle = useAnimatedStyle(() => {
        const safeHue = Math.round(hueVal.value);

        return {
            fontSize: fontSize.value,
            color: `hsl(${safeHue}, 100%, 50%)`,
            textShadowColor: `hsl(${safeHue}, 100%, 50%)`,
            textShadowRadius: 15,
            textShadowOffset: { width: 0, height: 0 },
        } as TextStyle;
    });

    // 7. RENDER
    return (
        <GestureDetector gesture={composedGestures}>
        <View style={styles.container}>
            <StatusBar hidden />


                <View style={styles.interactiveArea}>

                    <Animated.View style={[
                        styles.scroller,
                        { minWidth: width * 2 },
                        animatedContainerStyle
                    ]}>

                        <Animated.Text
                            style={[
                                styles.textBase,
                                animatedTextStyle
                            ]}
                            numberOfLines={1}
                        >
                            {text}
                        </Animated.Text>
                    </Animated.View>

                    <GridOverlay />

                </View>

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
        </GestureDetector>
    );
};

export default LedScroller;
// components/LedScroller.tsx
import React, {useEffect, useState} from 'react';
import {StatusBar, Text, TextStyle, TouchableOpacity, useWindowDimensions, View} from 'react-native';
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
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {styles} from './styles';
import {LedColorType, LedScrollerProps} from './types';
import {COLORS, LED_COLORS} from './constants'; // Import LED_COLORS pour l'init
import GridOverlay from './GridOverlay';
import HintContainer from './HintContainer';
import SettingsModal from './SettingsModal';

const LedScroller: React.FC<LedScrollerProps> = ({initialText = 'BONJOUR 2025'}) => {
    const {width} = useWindowDimensions();

    // 1. STATE
    const [text, setText] = useState<string>(initialText);
    const [selectedColor, setSelectedColor] = useState<LedColorType>(LED_COLORS[4]);
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(5000);

    // 2. SHARED VALUES
    const translateX: SharedValue<number> = useSharedValue(width);
    const fontSize: SharedValue<number> = useSharedValue(100);
    const savedFontSize: SharedValue<number> = useSharedValue(100);

    const hueVal: SharedValue<number> = useSharedValue(180);
    const satVal: SharedValue<number> = useSharedValue(100);
    const ligVal: SharedValue<number> = useSharedValue(50);

    // 3. SYNCHRONISATION
    useEffect(() => {
        // On anime les 3 valeurs pour une transition fluide vers le blanc/couleur
        hueVal.value = withTiming(selectedColor.hue, {duration: 500});
        satVal.value = withTiming(selectedColor.saturation, {duration: 500});
        ligVal.value = withTiming(selectedColor.lightness, {duration: 500});
    }, [selectedColor]);

    // 4. BOUCLE D'ANIMATION
    useEffect(() => {
        cancelAnimation(translateX);
        translateX.value = width;
        translateX.value = withRepeat(
            withTiming(-width * 4, {duration: speed, easing: Easing.linear}),
            -1, false
        );
    }, [text, speed, width]);

    // 5. GESTES
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

    // 6. STYLES ANIMÉS
    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
    }));

    const animatedTextStyle = useAnimatedStyle(() => {
        const h = Math.round(hueVal.value);
        const s = Math.round(satVal.value);
        const l = Math.round(ligVal.value);

        // Construction de la chaîne HSL dynamique
        const hslColor = `hsl(${h}, ${s}%, ${l}%)`;

        return {
            fontSize: fontSize.value,
            color: hslColor,
            textShadowColor: hslColor,
            textShadowRadius: 20,
            textShadowOffset: {width: 0, height: 0},
        } as TextStyle;
    });

    const currentStaticColor = `hsl(${selectedColor.hue}, ${selectedColor.saturation}%, ${selectedColor.lightness}%)`;

    // 7. RENDER
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
            <LinearGradient
                colors={[...COLORS.background]}
                style={styles.gradientBackground}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>LED Scroller</Text>
                    <Text style={styles.headerSubtitle}>2025 Edition</Text>
                </View>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => setSettingsOpen(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="settings-outline" size={24} color={COLORS.text}/>
                </TouchableOpacity>
            </View>

            <GestureDetector gesture={composedGestures}>
                <View style={styles.interactiveArea}>
                    {/* Mise à jour des couleurs de bordure statiques */}
                    <View style={[styles.ledDisplay, {borderColor: currentStaticColor}]}>
                        <View style={[styles.ledBorder, {
                            shadowColor: currentStaticColor,
                            shadowOffset: {width: 0, height: 0},
                            shadowOpacity: 0.8,
                            shadowRadius: 20,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }]}>
                            <Animated.View style={[
                                styles.scroller,
                                {minWidth: width * 2},
                                animatedContainerStyle
                            ]}>
                                <Animated.Text
                                    style={[styles.textBase, animatedTextStyle]}
                                    numberOfLines={1}
                                >
                                    {text}
                                </Animated.Text>
                            </Animated.View>
                            <GridOverlay/>
                        </View>
                    </View>
                    <HintContainer/>
                </View>
            </GestureDetector>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with ❤️ in 2025</Text>
            </View>

            <SettingsModal
                visible={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                text={text}
                onTextChange={setText}
                speed={speed}
                onSpeedChange={setSpeed}
                // Props mises à jour
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
            />
        </View>
    );
};

export default LedScroller;
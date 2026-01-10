import React, {useEffect, useState} from 'react';
import {StatusBar, useWindowDimensions, View, TextStyle, TouchableOpacity, Text} from 'react-native';
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
import {LedScrollerProps} from './types';
import {COLORS} from './constants';
import GridOverlay from './GridOverlay';
import HintContainer from './HintContainer';
import SettingsModal from './SettingsModal';

const LedScroller: React.FC<LedScrollerProps> = ({initialText = 'BONJOUR 2025'}) => {
    const { width } = useWindowDimensions();

    // 1. STATE REACT (Données logiques)
    const [text, setText] = useState<string>(initialText);
    const [hue, setHue] = useState<number>(180); // Teinte HSL (180 = Cyan - Modern look)
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(5000);

    // 2. SHARED VALUES (Données d'animation UI)
    const translateX: SharedValue<number> = useSharedValue(width);
    const fontSize: SharedValue<number> = useSharedValue(100);
    const savedFontSize: SharedValue<number> = useSharedValue(100);
    const hueVal: SharedValue<number> = useSharedValue(180);

    // 3. SYNCHRONISATION (React -> Reanimated)
    useEffect(() => {
        hueVal.value = withTiming(hue, { duration: 500 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // A. Style pour le CONTENEUR (position)
    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    // B. Style pour le TEXTE (couleur + taille + glow)
    const animatedTextStyle = useAnimatedStyle(() => {
        const safeHue = Math.round(hueVal.value);

        return {
            fontSize: fontSize.value,
            color: `hsl(${safeHue}, 100%, 50%)`,
            textShadowColor: `hsl(${safeHue}, 100%, 50%)`,
            textShadowRadius: 20, // Enhanced glow effect
            textShadowOffset: { width: 0, height: 0 },
        } as TextStyle;
    });

    // 7. RENDER
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>

            {/* Modern gradient background */}
            <LinearGradient
                colors={[...COLORS.background]}
                style={styles.gradientBackground}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            />

            {/* Modern Header */}
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
                    {/* LED Display Frame */}
                    <View style={[styles.ledDisplay, {borderColor: `hsl(${hue}, 100%, 30%)`}]}>
                        <View style={[styles.ledBorder, {
                            shadowColor: `hsl(${hue}, 100%, 50%)`,
                            shadowOffset: {width: 0, height: 0},
                            shadowOpacity: 0.8,
                            shadowRadius: 20,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }]}>
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
                    </View>

                    {/* Indication UX discrète */}
                    <HintContainer/>
                </View>
            </GestureDetector>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with ❤️ in 2025</Text>
            </View>

            {/* MODALE DE CONFIGURATION (Modern Bottom Sheet Style) */}
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
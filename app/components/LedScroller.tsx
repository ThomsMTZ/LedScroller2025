import React, {useEffect, useState} from 'react';
import {Dimensions, StatusBar, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    runOnJS
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

const {width} = Dimensions.get('window');

const LedScroller: React.FC<LedScrollerProps> = ({initialText = 'BONJOUR 2025'}) => {
    // 1. STATE (Typage explicite ou inféré)
    const [text, setText] = useState<string>(initialText);
    const [hue, setHue] = useState<number>(180); // Teinte HSL (180 = Cyan - Modern look)
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(5000);

    // 2. SHARED VALUES (Reanimated)
    // Ces valeurs vivent dans le UI Thread
    const translateX: SharedValue<number> = useSharedValue(width);
    const fontSize: SharedValue<number> = useSharedValue(100);
    const savedFontSize: SharedValue<number> = useSharedValue(100);

    // 3. BOUCLE D'ANIMATION
    useEffect(() => {
        cancelAnimation(translateX);
        translateX.value = width; // Reset position droite

        translateX.value = withRepeat(
            withTiming(-width * 4, {
                // On part loin à gauche
                duration: speed,
                easing: Easing.linear
            }),
            -1, // Infini
            false // Pas de reverse
        );
    }, [text, speed, translateX]); // Se relance si le texte ou la vitesse change

    // 4. GESTION DES GESTES (Gesture Handler 2.0)

    // Geste : Pincement pour zoomer
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
            'worklet'; // Indique que cette fonction tourne sur le UI Thread
            fontSize.value = savedFontSize.value * e.scale;
        })
        .onEnd(() => {
            'worklet';
            savedFontSize.value = fontSize.value;
        });

    // Geste : Double Tap pour ouvrir les options
    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            // runOnJS permet de rappeler le Thread JS pour changer le State React
            runOnJS(setSettingsOpen)(true);
        });

    // On combine les gestes (Race = le premier détecté gagne, ou Simultaneous selon besoin)
    // Ici Race fonctionne bien car un Pinch n'est pas un Tap
    const composedGestures = Gesture.Race(pinchGesture, doubleTapGesture);

    // 5. STYLES ANIMÉS
    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: translateX.value}],
            fontSize: fontSize.value,
            color: `hsl(${hue}, 100%, 50%)`,
            textShadowColor: `hsl(${hue}, 100%, 50%)`,
            textShadowRadius: 20, // Enhanced glow effect
            textShadowOffset: {width: 0, height: 0},
        } as TextStyle;
    });

    // 6. RENDER
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
                            {/* Calque Grille LED (Simulation) */}
                            <GridOverlay/>

                            <Animated.View style={[styles.scroller, animatedTextStyle]}>
                                {/* Astuce: Monospace simule l'alignement LED en attendant une Font custom */}
                                <Text style={styles.textBase} numberOfLines={1}>
                                    {text}
                                </Text>
                            </Animated.View>
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

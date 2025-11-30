import React, {useEffect, useState} from 'react';
import {Dimensions, StatusBar, Text, TextStyle, View} from 'react-native';
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
import {styles} from './styles';
import {LedScrollerProps} from './types';
import GridOverlay from './GridOverlay';
import HintContainer from './HintContainer';
import SettingsModal from './SettingsModal';
import {scheduleOnRN} from "react-native-worklets";

const {width} = Dimensions.get('window');

const LedScroller: React.FC<LedScrollerProps> = ({initialText = 'BONJOUR 2025'}) => {
    // 1. STATE (Typage explicite ou inféré)
    const [text, setText] = useState<string>(initialText);
    const [hue, setHue] = useState<number>(120); // Teinte HSL (120 = Vert)
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(150000);

    // 2. SHARED VALUES (Reanimated)
    // Ces valeurs vivent dans le UI Thread
    const translateX: SharedValue<number> = useSharedValue(width);
    const fontSize: SharedValue<number> = useSharedValue(120);
    const savedFontSize: SharedValue<number> = useSharedValue(120);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, speed]); // Se relance si le texte ou la vitesse change

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
    // scheduleOnRN permet de rappeler le Thread JS pour changer le State React
            scheduleOnRN(setSettingsOpen,true);
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
            textShadowRadius: 15 // Effet Glow néon
        } as TextStyle;
    });

    // 6. RENDER
    return (
        <View style={styles.container}>
            <StatusBar hidden/>

            <GestureDetector gesture={composedGestures}>
                <View style={styles.interactiveArea}>
                    {/* Calque Grille LED (Simulation) */}
                    <GridOverlay/>

                    <Animated.View style={[styles.scroller, animatedTextStyle]}>
                        {/* Astuce: Monospace simule l'alignement LED en attendant une Font custom */}
                        <Text style={styles.textBase} numberOfLines={1}>
                            {text}
                        </Text>
                    </Animated.View>

                    {/* Indication UX discrète */}
                    <HintContainer/>
                </View>
            </GestureDetector>

            {/* MODALE DE CONFIGURATION (Bottom Sheet Style) */}
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

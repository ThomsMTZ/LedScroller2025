import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    GestureUpdateEvent,
    PinchGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import {Ionicons} from '@expo/vector-icons';

// --- TYPAGE & CONSTANTES ---

const {width} = Dimensions.get('window');

// Interface pour les props du composant (extensible futur)
interface LedScrollerProps {
    initialText?: string;
}

// Interface pour typer strictement les styles (Best Practice TS)
interface Styles {
    container: ViewStyle;
    interactiveArea: ViewStyle;
    scroller: ViewStyle;
    textBase: TextStyle;
    gridOverlay: ViewStyle;
    hintContainer: ViewStyle;
    hintText: TextStyle;
    modalOverlay: ViewStyle;
    modalContent: ViewStyle;
    headerModal: ViewStyle;
    modalTitle: TextStyle;
    input: TextStyle;
    label: TextStyle;
    colorRow: ViewStyle;
    colorDot: ViewStyle;
}

// --- COMPOSANT PRINCIPAL ---

export default function App() {
    // GestureHandlerRootView est requis à la racine pour la gestion des gestes avancés
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <LedScroller/>
        </GestureHandlerRootView>
    );
}

// --- COMPOSANT METIER ---

const LedScroller: React.FC<LedScrollerProps> = ({initialText = "BONJOUR 2025"}) => {

    // 1. STATE (Typage explicite ou inféré)
    const [text, setText] = useState<string>(initialText);
    const [hue, setHue] = useState<number>(120); // Teinte HSL (120 = Vert)
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(5000);

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
            withTiming(-width * 4, { // On part loin à gauche
                duration: speed,
                easing: Easing.linear
            }),
            -1, // Infini
            false // Pas de reverse
        );
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
            textShadowRadius: 15, // Effet Glow néon
        } as TextStyle;
    });

    // 6. RENDER
    return (
        <View style={styles.container}>
            <StatusBar hidden/>

            <GestureDetector gesture={composedGestures}>
                <View style={styles.interactiveArea}>

                    {/* Calque Grille LED (Simulation) */}
                    <View style={styles.gridOverlay} pointerEvents="none"/>

                    <Animated.View style={[styles.scroller, animatedTextStyle]}>
                        {/* Astuce: Monospace simule l'alignement LED en attendant une Font custom */}
                        <Text style={styles.textBase} numberOfLines={1}>
                            {text}
                        </Text>
                    </Animated.View>

                    {/* Indication UX discrète */}
                    <View style={styles.hintContainer} pointerEvents="none">
                        <Text style={styles.hintText}>Double-tap: Options • Pinch: Zoom</Text>
                    </View>
                </View>
            </GestureDetector>

            {/* MODALE DE CONFIGURATION (Bottom Sheet Style) */}
            <Modal
                visible={isSettingsOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setSettingsOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        <View style={styles.headerModal}>
                            <Text style={styles.modalTitle}>Configuration</Text>
                            <TouchableOpacity onPress={() => setSettingsOpen(false)}>
                                <Ionicons name="close-circle" size={30} color="#fff"/>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            style={styles.input}
                            value={text}
                            onChangeText={setText}
                            placeholder="Votre texte..."
                            placeholderTextColor="#666"
                        />

                        <Text style={styles.label}>Vitesse</Text>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={10000}
                            maximumValue={1000}
                            value={speed}
                            onSlidingComplete={setSpeed}
                            minimumTrackTintColor={`hsl(${hue}, 100%, 50%)`}
                            maximumTrackTintColor="#555"
                            thumbTintColor={`hsl(${hue}, 100%, 50%)`}
                        />

                        <Text style={styles.label}>Couleur LED</Text>
                        <View style={styles.colorRow}>
                            {[0, 120, 240, 60, 300].map((h) => (
                                <TouchableOpacity
                                    key={h}
                                    style={[
                                        styles.colorDot,
                                        {
                                            backgroundColor: `hsl(${h}, 100%, 50%)`,
                                            borderWidth: hue === h ? 2 : 0
                                        }
                                    ]}
                                    onPress={() => setHue(h)}
                                />
                            ))}
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
}

// --- FEUILLE DE STYLE TYPÉE ---

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    interactiveArea: {
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    scroller: {
        flexDirection: 'row',
        minWidth: width * 2
    },
    textBase: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        includeFontPadding: false,
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: 10,
        opacity: 0.2,
        // Astuce future: mettre une image de grille ici
    },
    hintContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        opacity: 0.4,
    },
    hintText: {
        color: '#fff',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 2
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        paddingBottom: 50
    },
    headerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        fontSize: 18,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20
    },
    label: {
        color: '#aaa',
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 10
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15
    },
    colorDot: {
        width: 45,
        height: 45,
        borderRadius: 25,
        borderColor: '#fff'
    },
});
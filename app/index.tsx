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
    withTiming,
    FadeIn,
    FadeOut
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
import {LinearGradient} from 'expo-linear-gradient';

// --- TYPAGE & CONSTANTES ---

const {width} = Dimensions.get('window');

// Modern 2025 color palette
const COLORS = {
    background: ['#0a0a0a', '#1a1a2e', '#16213e'],
    accent: '#00d4ff',
    surface: 'rgba(30, 30, 50, 0.8)',
    surfaceLight: 'rgba(255, 255, 255, 0.05)',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
};

// Expanded color presets for LED
const LED_COLORS = [
    {hue: 0, name: 'Rouge'},      // Red
    {hue: 30, name: 'Orange'},    // Orange
    {hue: 60, name: 'Jaune'},     // Yellow
    {hue: 120, name: 'Vert'},     // Green
    {hue: 180, name: 'Cyan'},     // Cyan
    {hue: 210, name: 'Bleu'},     // Blue
    {hue: 270, name: 'Violet'},   // Purple
    {hue: 300, name: 'Magenta'},  // Magenta
    {hue: 330, name: 'Rose'},     // Pink
];

// Interface pour les props du composant (extensible futur)
interface LedScrollerProps {
    initialText?: string;
}

// Interface pour typer strictement les styles (Best Practice TS)
interface Styles {
    container: ViewStyle;
    gradientBackground: ViewStyle;
    header: ViewStyle;
    headerTitle: TextStyle;
    headerSubtitle: TextStyle;
    settingsButton: ViewStyle;
    interactiveArea: ViewStyle;
    ledDisplay: ViewStyle;
    ledBorder: ViewStyle;
    scroller: ViewStyle;
    textBase: TextStyle;
    gridOverlay: ViewStyle;
    hintContainer: ViewStyle;
    hintText: TextStyle;
    hintIcon: ViewStyle;
    modalOverlay: ViewStyle;
    modalContent: ViewStyle;
    modalHandle: ViewStyle;
    headerModal: ViewStyle;
    modalTitle: TextStyle;
    closeButton: ViewStyle;
    section: ViewStyle;
    input: TextStyle;
    label: TextStyle;
    colorGrid: ViewStyle;
    colorButton: ViewStyle;
    colorButtonSelected: ViewStyle;
    colorDot: ViewStyle;
    sliderContainer: ViewStyle;
    sliderLabels: ViewStyle;
    sliderLabel: TextStyle;
    footer: ViewStyle;
    footerText: TextStyle;
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
            withTiming(-width * 4, { // On part loin à gauche
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
                colors={COLORS.background as [string, string, string]}
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
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }]}>
                            {/* Calque Grille LED (Simulation) */}
                            <View style={styles.gridOverlay} pointerEvents="none"/>

                            <Animated.View style={[styles.scroller, animatedTextStyle]}>
                                {/* Astuce: Monospace simule l'alignement LED en attendant une Font custom */}
                                <Text style={styles.textBase} numberOfLines={1}>
                                    {text}
                                </Text>
                            </Animated.View>
                        </View>
                    </View>

                    {/* Indication UX discrète */}
                    <Animated.View 
                        style={styles.hintContainer} 
                        pointerEvents="none"
                        entering={FadeIn.delay(500).duration(1000)}
                    >
                        <View style={styles.hintIcon}>
                            <Ionicons name="hand-left-outline" size={14} color={COLORS.textMuted}/>
                        </View>
                        <Text style={styles.hintText}>Double-tap: Options</Text>
                        <Text style={styles.hintText}>•</Text>
                        <Text style={styles.hintText}>Pinch: Zoom</Text>
                    </Animated.View>
                </View>
            </GestureDetector>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with ❤️ in 2025</Text>
            </View>

            {/* MODALE DE CONFIGURATION (Modern Bottom Sheet Style) */}
            <Modal
                visible={isSettingsOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setSettingsOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={{flex: 1}} 
                        activeOpacity={1}
                        onPress={() => setSettingsOpen(false)}
                    />
                    <Animated.View 
                        style={styles.modalContent}
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(200)}
                    >
                        {/* Modal Handle */}
                        <View style={styles.modalHandle}/>

                        <View style={styles.headerModal}>
                            <Text style={styles.modalTitle}>⚙️ Configuration</Text>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setSettingsOpen(false)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={24} color={COLORS.text}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>💬 Message</Text>
                            <TextInput
                                style={styles.input}
                                value={text}
                                onChangeText={setText}
                                placeholder="Entrez votre message..."
                                placeholderTextColor={COLORS.textMuted}
                                selectionColor={`hsl(${hue}, 100%, 50%)`}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>⚡ Vitesse de défilement</Text>
                            <View style={styles.sliderContainer}>
                                <Slider
                                    style={{width: '100%', height: 40}}
                                    minimumValue={10000}
                                    maximumValue={1000}
                                    value={speed}
                                    onSlidingComplete={setSpeed}
                                    minimumTrackTintColor={`hsl(${hue}, 100%, 50%)`}
                                    maximumTrackTintColor={COLORS.border}
                                    thumbTintColor={`hsl(${hue}, 100%, 60%)`}
                                />
                                <View style={styles.sliderLabels}>
                                    <Text style={styles.sliderLabel}>Lent</Text>
                                    <Text style={styles.sliderLabel}>Rapide</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>🎨 Couleur LED</Text>
                            <View style={styles.colorGrid}>
                                {LED_COLORS.map((color) => (
                                    <TouchableOpacity
                                        key={color.hue}
                                        style={[
                                            styles.colorButton,
                                            hue === color.hue && styles.colorButtonSelected,
                                            hue === color.hue && {
                                                borderColor: `hsl(${color.hue}, 100%, 50%)`,
                                            }
                                        ]}
                                        onPress={() => setHue(color.hue)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[
                                            styles.colorDot,
                                            {
                                                backgroundColor: `hsl(${color.hue}, 100%, 50%)`,
                                                shadowColor: `hsl(${color.hue}, 100%, 50%)`,
                                            }
                                        ]}/>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

// --- FEUILLE DE STYLE TYPÉE ---

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 20,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    headerSubtitle: {
        color: COLORS.textMuted,
        fontSize: 12,
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginTop: 2,
    },
    settingsButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    interactiveArea: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    ledDisplay: {
        borderWidth: 2,
        borderRadius: 16,
        padding: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    ledBorder: {
        borderRadius: 12,
        overflow: 'hidden',
        paddingVertical: 30,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    scroller: {
        flexDirection: 'row',
        minWidth: width * 2,
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
        opacity: 0.15,
    },
    hintContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 8,
        opacity: 0.6,
    },
    hintIcon: {
        marginRight: 4,
    },
    hintText: {
        color: COLORS.textMuted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: '500',
    },
    footer: {
        paddingBottom: 30,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: 12,
        letterSpacing: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderBottomWidth: 0,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.textMuted,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    headerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: 24,
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: COLORS.text,
        fontSize: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    label: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'flex-start',
    },
    colorButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorButtonSelected: {
        borderWidth: 2,
    },
    colorDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    sliderContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
        padding: 12,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        marginTop: 4,
    },
    sliderLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
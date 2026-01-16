import React, {useEffect, useState} from 'react';
import {StatusBar, Text, TextStyle, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
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
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './styles';
import {LedColorType, LedScrollerProps} from './types';
import {COLORS, LED_COLORS} from './constants';
import GridOverlay from './GridOverlay';
import HintContainer from './HintContainer';
import SettingsModal from './SettingsModal';

const LedScroller: React.FC<LedScrollerProps> = ({initialText = 'BONJOUR 2025'}) => {
    const {width, height} = useWindowDimensions();
    const STORAGE_KEY = '@led_scroller_settings_v1';

    // 1. STATE
    const [text, setText] = useState<string>(initialText);
    const [selectedColor, setSelectedColor] = useState<LedColorType>(LED_COLORS[4]);
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(100);
    const [textWidth, setTextWidth] = useState<number>(0);
    const [isLandscapeLocked, setIsLandscapeLocked] = useState<boolean>(false);
    const [showBorder, setShowBorder] = useState<boolean>(true);

    // États pour les effets
    const [isTextBlinking, setIsTextBlinking] = useState<boolean>(false);
    const [isBorderBlinking, setIsBorderBlinking] = useState<boolean>(false);

    // 2. SHARED VALUES
    const translateX: SharedValue<number> = useSharedValue(width);
    const fontSize: SharedValue<number> = useSharedValue(100);
    const savedFontSize: SharedValue<number> = useSharedValue(100);

    // Valeur d'animation pour l'opacité (clignotement)
    const blinkOpacity: SharedValue<number> = useSharedValue(1);

    const hueVal: SharedValue<number> = useSharedValue(180);
    const satVal: SharedValue<number> = useSharedValue(100);
    const ligVal: SharedValue<number> = useSharedValue(50);

    const isLandscape = width > height;
    const LOOP_SPACING = width * 0.3;
    const patternWidth = textWidth + LOOP_SPACING;
    const copiesNeeded = textWidth > 0
        ? Math.ceil(width / patternWidth) + 1
        : 2;
    const finalRepetitions = Math.max(2, copiesNeeded);
    const copiesArray = Array.from({length: finalRepetitions});

    // 3. LOGIQUE DE CLIGNOTEMENT (CORRIGÉE)
    useEffect(() => {
        if (isTextBlinking || isBorderBlinking) {
            // Animation : opacité de 1 -> 0.4 -> 1 en boucle
            blinkOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.4, {duration: 500}),
                    withTiming(1, {duration: 500})
                ),
                -1, // Infini
                true // Reverse
            );
        } else {
            // Retour propre à l'opacité 1
            blinkOpacity.value = withTiming(1, {duration: 300});
        }

        // 👇👇👇 AJOUT CRUCIAL 1 : Nettoyage de l'animation de clignotement 👇👇👇
        return () => {
            cancelAnimation(blinkOpacity);
        };
    }, [isTextBlinking, isBorderBlinking]);

    // FONCTION DE BASCULE ORIENTATION
    const toggleOrientation = async () => {
        if (isLandscapeLocked) {
            await ScreenOrientation.unlockAsync();
            setIsLandscapeLocked(false);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setIsLandscapeLocked(true);
        }
    };

    // 4. SYNCHRONISATION COULEUR
    useEffect(() => {
        hueVal.value = withTiming(selectedColor.hue, {duration: 500});
        satVal.value = withTiming(selectedColor.saturation, {duration: 500});
        ligVal.value = withTiming(selectedColor.lightness, {duration: 500});
    }, [selectedColor]);

    // 5. BOUCLE D'ANIMATION DE SCROLL (CORRIGÉE)
    useEffect(() => {
        if (textWidth > 0) {
            cancelAnimation(translateX);
            translateX.value = 0;

            const safeSpeed = speed > 0 ? speed : 1;
            const linearDuration = (patternWidth / safeSpeed) * 1000;

            translateX.value = withRepeat(
                withTiming(-patternWidth, {
                    duration: linearDuration,
                    easing: Easing.linear
                }),
                -1, false
            );
        }

        // 👇👇👇 AJOUT CRUCIAL 2 : Nettoyage de l'animation de scroll 👇👇👇
        return () => {
            cancelAnimation(translateX);
        };
    }, [textWidth, speed, width, patternWidth]);

    // 6. GESTES (ZOOM SIMPLE)
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

    // 7. STYLES ANIMÉS
    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
    }));

    // Style du texte avec gestion de l'opacité pour le clignotement
    const animatedTextStyle = useAnimatedStyle(() => {
        const h = Math.round(hueVal.value);
        const s = Math.round(satVal.value);
        const l = Math.round(ligVal.value);
        const hslColor = `hsl(${h}, ${s}%, ${l}%)`;

        return {
            fontSize: fontSize.value,
            color: hslColor,
            textShadowColor: hslColor,
            textShadowRadius: 20,
            textShadowOffset: {width: 0, height: 0},
            opacity: isTextBlinking ? blinkOpacity.value : 1 // Application de l'effet
        } as TextStyle;
    });

    // Style de la bordure avec gestion de l'opacité
    const animatedBorderStyle = useAnimatedStyle(() => ({
        opacity: isBorderBlinking ? blinkOpacity.value : 1
    }));

    const currentStaticColor = `hsl(${selectedColor.hue}, ${selectedColor.saturation}%, ${selectedColor.lightness}%)`;

    // 8. LOAD & SAVE SETTINGS
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonValue != null) {
                    const savedSettings = JSON.parse(jsonValue);

                    if (savedSettings.text) setText(savedSettings.text);
                    if (savedSettings.speed) setSpeed(savedSettings.speed);
                    if (savedSettings.selectedColor) setSelectedColor(savedSettings.selectedColor);

                    if (savedSettings.isLandscapeLocked) {
                        setIsLandscapeLocked(true);
                        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                    }
                    if (savedSettings.showBorder !== undefined) {
                        setShowBorder(savedSettings.showBorder);
                    }
                    // Chargement des effets
                    if (savedSettings.isTextBlinking !== undefined) setIsTextBlinking(savedSettings.isTextBlinking);
                    if (savedSettings.isBorderBlinking !== undefined) setIsBorderBlinking(savedSettings.isBorderBlinking);
                }
            } catch (e) {
                console.error("Erreur lors du chargement des paramètres", e);
            }
        };

        void loadSettings();
    }, []);

    useEffect(() => {
        const saveTimeout = setTimeout(async () => {
            try {
                const settingsToSave = {
                    text,
                    speed,
                    selectedColor,
                    isLandscapeLocked,
                    showBorder,
                    isTextBlinking,
                    isBorderBlinking
                };
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
            } catch (e) {
                console.error("Erreur sauvegarde", e);
            }
        }, 1000);

        return () => clearTimeout(saveTimeout);

    }, [text, speed, selectedColor, isLandscapeLocked, showBorder, isTextBlinking, isBorderBlinking]);

    // 9. RENDER
    return (
        <View style={styles.container}>
            <StatusBar
                hidden={isLandscape}
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <LinearGradient
                colors={[...COLORS.background]}
                style={styles.gradientBackground}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            />

            {!isLandscape && (
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>LED Scroller</Text>
                        <Text style={styles.headerSubtitle}>2026 Edition</Text>
                    </View>
                    <TouchableOpacity
                        testID="settings-button"
                        style={styles.settingsButton}
                        onPress={() => setSettingsOpen(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings-outline" size={24} color={COLORS.text}/>
                    </TouchableOpacity>
                </View>
            )}

            <GestureDetector gesture={composedGestures}>
                <View
                    key={isLandscape ? 'landscape' : 'portrait'}
                    testID="gesture-detector"

                    style={[
                        styles.interactiveArea,
                        isLandscape && {
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            paddingHorizontal: 0,
                            backgroundColor: 'black',
                            zIndex: 999,
                        }
                    ]}
                >
                    <Animated.View
                        testID="led-display"
                        style={[
                            styles.ledDisplay,
                            {borderColor: currentStaticColor},
                            animatedBorderStyle,
                            isLandscape && {
                                flex: 1,
                                width: '100%',
                                height: '100%',
                                borderRadius: 0,
                                padding: 0,
                                borderWidth: showBorder ? 4 : 0,
                                backgroundColor: 'black',
                            }
                        ]}>
                        <View style={[styles.ledBorder, {
                            shadowColor: currentStaticColor,
                            shadowOffset: {width: 0, height: 0},
                            shadowOpacity: 0.8,
                            shadowRadius: 20,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        },
                            isLandscape && {
                                width: '100%',
                                flex: 1,
                                borderRadius: 0,
                                paddingVertical: 0,
                                justifyContent: 'center'
                            }
                        ]}>
                            <Animated.View
                                testID="scrolling-container"
                                style={[styles.scroller,
                                    {
                                        minWidth: width * 2,
                                        alignSelf: 'flex-start',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    },
                                    animatedContainerStyle,
                                ]}>
                                {copiesArray.map((_, index) => (
                                    <React.Fragment key={index}>
                                        <Animated.Text
                                            testID="scrolling-text"
                                            onLayout={index === 0 ? (e) => setTextWidth(e.nativeEvent.layout.width) : undefined}
                                            style={[
                                                styles.textBase,
                                                animatedTextStyle,
                                            ]}
                                            numberOfLines={1}
                                            ellipsizeMode="clip"
                                        >
                                            {text}
                                        </Animated.Text>
                                        <View style={{width: LOOP_SPACING}}/>
                                    </React.Fragment>
                                ))}
                            </Animated.View>
                            <GridOverlay/>
                        </View>
                    </Animated.View>
                    {!isLandscape && <HintContainer/>}
                </View>
            </GestureDetector>

            {!isLandscape && (
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with ❤️ by Thomas Martinez</Text>
                </View>
            )}

            <SettingsModal
                visible={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                text={text}
                onTextChange={setText}
                speed={speed}
                onSpeedChange={setSpeed}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                isLandscapeLocked={isLandscapeLocked}
                onToggleOrientation={toggleOrientation}
                showBorder={showBorder}
                onToggleBorder={() => setShowBorder(!showBorder)}
                isTextBlinking={isTextBlinking}
                onToggleTextBlinking={() => setIsTextBlinking(!isTextBlinking)}
                isBorderBlinking={isBorderBlinking}
                onToggleBorderBlinking={() => setIsBorderBlinking(!isBorderBlinking)}
            />

            {isLandscape && (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        padding: 10,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: 20,
                        zIndex: 100
                    }}
                    onPress={() => setSettingsOpen(true)}
                >
                    <Ionicons name="settings-outline" size={24} color="rgba(255,255,255,0.5)"/>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default LedScroller;
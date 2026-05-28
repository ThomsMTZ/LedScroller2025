import React from 'react';
import {StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View,} from 'react-native';
import Animated from 'react-native-reanimated';
import {GestureDetector} from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {styles} from './styles';
import {LedScrollerProps} from './types';
import {COLORS} from './constants';
import GridOverlay from './GridOverlay';
import HintContainer from './HintContainer';
import SettingsModal from './SettingsModal/SettingsModal';
import LedBorder from './LedBorder';
import {useLedSettings} from './useLedSettings';
import {useLedAnimation} from './useLedAnimation';

const LedScroller: React.FC<LedScrollerProps> = ({initialText = 'BONJOUR 2025'}) => {
    const {width, height} = useWindowDimensions();
    const isLandscape = width > height;

    // --- Settings ---
    const {
        text, setText,
        speed, setSpeed,
        selectedColor, setSelectedColor,
        showBorder,
        isBorderChase,
        isBorderBlinking,
        isLandscapeLocked,
        isTextBlinking,
        isReverseScroll,
        recentMessages,
        favoriteMessages,
        isSettingsOpen,
        onOpenSettings,
        onCloseSettings,
        onToggleOrientation,
        onToggleBorder,
        onToggleBorderChase,
        onToggleBorderBlinking,
        onToggleTextBlinking,
        onToggleReverseScroll,
        onToggleFavorite,
        onSelectRecentMessage,
    } = useLedSettings(initialText);

    // --- Animation ---
    const {
        componentId,
        setTextWidth,
        copiesArray,
        LOOP_SPACING,
        PORTRAIT_PANEL_HEIGHT,
        hueVal,
        satVal,
        ligVal,
        composedGestures,
        animatedContainerStyle,
        animatedTextStyle,
        animatedBorderOpacityStyle,
        animatedBorderColorStyle,
        animatedShadowColorStyle,
    } = useLedAnimation({
        text,
        speed,
        isReverseScroll,
        isTextBlinking,
        isBorderBlinking,
        selectedColor,
        isLandscape,
        onDoubleTap: onOpenSettings,
    });

    // --- Dérivés d'affichage ---
    const isChaseActive = showBorder && isBorderChase;
    const showNativeBorder = showBorder && !isBorderChase;

    const getDisplayBorderRadius = (): number => {
        if (isLandscape) return 0;
        if (isChaseActive) return 12;
        return 16;
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={isLandscape} barStyle="light-content" backgroundColor="transparent" translucent/>
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
                        onPress={onOpenSettings}
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
                            position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
                            paddingHorizontal: 0, backgroundColor: 'black', zIndex: 999,
                        },
                    ]}
                >
                    <Animated.View
                        testID="led-display"
                        style={[
                            styles.ledDisplay,
                            animatedBorderColorStyle,
                            {
                                borderWidth: showNativeBorder ? 4 : 0,
                                backgroundColor: isChaseActive ? '#050505' : 'black',
                                height: isLandscape ? '100%' : PORTRAIT_PANEL_HEIGHT,
                                overflow: 'hidden',
                                position: 'relative',
                            },
                            isLandscape && {
                                flex: 1, width: '100%', height: '100%',
                                borderRadius: 0, padding: 0,
                                borderWidth: showNativeBorder ? 4 : 0,
                                backgroundColor: isChaseActive ? '#050505' : 'black',
                            },
                        ]}
                    >
                        {isChaseActive && (
                            <Animated.View style={[
                                StyleSheet.absoluteFill,
                                animatedBorderOpacityStyle,
                                {overflow: 'hidden', borderRadius: isLandscape ? 0 : 16},
                            ]}>
                                <LedBorder
                                    color={`hsl(${Math.round(hueVal.value)}, ${Math.round(satVal.value)}%, ${Math.round(ligVal.value)}%)`}
                                    isAnimating={true}
                                    speed={speed}
                                />
                            </Animated.View>
                        )}

                        <Animated.View style={[
                            styles.ledBorder,
                            animatedShadowColorStyle,
                            {
                                shadowOffset: {width: 0, height: 0},
                                shadowOpacity: 0.8,
                                shadowRadius: 20,
                                backgroundColor: '#0a0a0a',
                                flex: 1,
                                margin: isChaseActive ? 4 : 0,
                                borderRadius: getDisplayBorderRadius(),
                                justifyContent: 'center',
                                paddingVertical: 0,
                            },
                            !isChaseActive && {width: '100%'},
                            isLandscape && {
                                flex: 1,
                                borderRadius: 0,
                                paddingVertical: 0,
                                justifyContent: 'center',
                                margin: isChaseActive ? 4 : 0,
                            },
                        ]}>
                            <Animated.View
                                testID="scrolling-container"
                                style={[
                                    styles.scroller,
                                    {
                                        minWidth: width * 2,
                                        alignSelf: 'flex-start',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    },
                                    animatedContainerStyle,
                                ]}
                            >
                                {copiesArray.map((_, index) => (
                                    <React.Fragment key={`${componentId}-text-copy-${index}`}>
                                        <Animated.Text
                                            testID="scrolling-text"
                                            onLayout={index === 0
                                                ? (e) => setTextWidth(e.nativeEvent.layout.width)
                                                : undefined}
                                            style={[styles.textBase, animatedTextStyle]}
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
                        </Animated.View>
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
                onClose={onCloseSettings}
                text={text}
                onTextChange={setText}
                speed={speed}
                onSpeedChange={setSpeed}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                isLandscapeLocked={isLandscapeLocked}
                onToggleOrientation={onToggleOrientation}
                isReverseScroll={isReverseScroll}
                onToggleReverseScroll={onToggleReverseScroll}
                showBorder={showBorder}
                onToggleBorder={onToggleBorder}
                isBorderChase={isBorderChase}
                onToggleBorderChase={onToggleBorderChase}
                isBorderBlinking={isBorderBlinking}
                onToggleBorderBlinking={onToggleBorderBlinking}
                isTextBlinking={isTextBlinking}
                onToggleTextBlinking={onToggleTextBlinking}
                recentMessages={recentMessages}
                favoriteMessages={favoriteMessages}
                onToggleFavorite={onToggleFavorite}
                onSelectRecentMessage={onSelectRecentMessage}
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
                        zIndex: 100,
                    }}
                    onPress={onOpenSettings}
                >
                    <Ionicons name="settings-outline" size={24} color="rgba(255,255,255,0.5)"/>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default LedScroller;

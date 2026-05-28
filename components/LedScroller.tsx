import React from 'react';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {Platform, StatusBar, Text, TouchableOpacity, useWindowDimensions, View,} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {styles} from './styles';
import {LedScrollerProps} from './types';
import {COLORS} from './constants';
import HintContainer from './HintContainer';
import SettingsModal from './SettingsModal/SettingsModal';
import {useLedSettings} from './useLedSettings';
import {useLedAnimation} from './useLedAnimation';
import LedDisplayPanel from './LedDisplayPanel';

const LedScroller: React.FC<LedScrollerProps> = ({initialText = 'BONJOUR 2025'}) => {
    const {width, height} = useWindowDimensions();
    const isLandscape = width > height;

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : Platform.select({
            android: 'ca-app-pub-2790650155402757/5652248123',
            ios: 'ca-app-pub-2790650155402757/6773987013',
            default: TestIds.BANNER,
        });


    // --- Settings ---
    const settings = useLedSettings(initialText);

    // --- Animation ---
    const animation = useLedAnimation({
        text: settings.text,
        speed: settings.speed,
        isReverseScroll: settings.isReverseScroll,
        isTextBlinking: settings.isTextBlinking,
        isBorderBlinking: settings.isBorderBlinking,
        selectedColor: settings.selectedColor,
        isLandscape,
        onDoubleTap: settings.onOpenSettings,
    });

    // --- Dérivés d'affichage ---
    const isChaseActive = settings.showBorder && settings.isBorderChase;
    const showNativeBorder = settings.showBorder && !isChaseActive;

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
                        onPress={settings.onOpenSettings}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings-outline" size={24} color={COLORS.text}/>
                    </TouchableOpacity>
                </View>
            )}

            <GestureDetector gesture={animation.composedGestures}>
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
                    <LedDisplayPanel
                        isLandscape={isLandscape}
                        showNativeBorder={showNativeBorder}
                        isChaseActive={isChaseActive}
                        PORTRAIT_PANEL_HEIGHT={animation.PORTRAIT_PANEL_HEIGHT}
                        animatedBorderColorStyle={animation.animatedBorderColorStyle}
                        animatedBorderOpacityStyle={animation.animatedBorderOpacityStyle}
                        animatedShadowColorStyle={animation.animatedShadowColorStyle}
                        animatedContainerStyle={animation.animatedContainerStyle}
                        animatedTextStyle={animation.animatedTextStyle}
                        hueVal={animation.hueVal}
                        satVal={animation.satVal}
                        ligVal={animation.ligVal}
                        speed={settings.speed}
                        componentId={animation.componentId}
                        text={settings.text}
                        setTextWidth={animation.setTextWidth}
                        copiesArray={animation.copiesArray}
                        LOOP_SPACING={animation.LOOP_SPACING}
                    />

                    {!isLandscape && <HintContainer/>}
                </View>
            </GestureDetector>

            {!isLandscape && (
                <View style={{alignItems: 'center', paddingVertical: 10, backgroundColor: 'transparent'}}>
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.BANNER}
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                        }}
                    />
                </View>
            )}


            {!isLandscape && (
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with ❤️ by Thomas Martinez</Text>
                </View>
            )}

            <SettingsModal
                visible={settings.isSettingsOpen}
                onClose={settings.onCloseSettings}
                text={settings.text}
                onTextChange={settings.onTextChange}
                speed={settings.speed}
                onSpeedChange={settings.onSpeedChange}
                selectedColor={settings.selectedColor}
                onColorChange={settings.onColorChange}
                isLandscapeLocked={settings.isLandscapeLocked}
                onToggleOrientation={settings.onToggleOrientation}
                isReverseScroll={settings.isReverseScroll}
                onToggleReverseScroll={settings.onToggleReverseScroll}
                showBorder={settings.showBorder}
                onToggleBorder={settings.onToggleBorder}
                isBorderChase={settings.isBorderChase}
                onToggleBorderChase={settings.onToggleBorderChase}
                isBorderBlinking={settings.isBorderBlinking}
                onToggleBorderBlinking={settings.onToggleBorderBlinking}
                isTextBlinking={settings.isTextBlinking}
                onToggleTextBlinking={settings.onToggleTextBlinking}
                recentMessages={settings.recentMessages}
                favoriteMessages={settings.favoriteMessages}
                onToggleFavorite={settings.onToggleFavorite}
                onSelectRecentMessage={settings.onSelectRecentMessage}
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
                    onPress={settings.onOpenSettings}
                >
                    <Ionicons name="settings-outline" size={24} color="rgba(255,255,255,0.5)"/>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default LedScroller;
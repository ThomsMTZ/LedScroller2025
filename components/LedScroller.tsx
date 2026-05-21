import React, {useState} from 'react';
import {ActivityIndicator, Platform, Text, useWindowDimensions, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {GestureDetector} from 'react-native-gesture-handler';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads'; // Ajuste l'import selon ta librairie
import {useLedSettings} from './useLedSettings';
import LedBorder from './LedBorder';
import {styles} from './styles';
import {SettingsModal} from "./index";
import {useLedAnimations} from "./useLedAnimation";

const COPIES_COUNT = 4;
const copiesArray = Array.from({length: COPIES_COUNT});

const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        android: 'ca-app-pub-2790650155402757/5652248123',
        ios: 'ca-app-pub-2790650155402757/6773987013',
        default: TestIds.BANNER,
    });

const LedScroller: React.FC = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    const {width, height} = useWindowDimensions();
    const isLandscape = width > height;

    const {isLoaded, ...settings} = useLedSettings();

    const currentHsl = `hsl(${settings.selectedColor.hue}, ${settings.selectedColor.saturation}%, ${settings.selectedColor.lightness}%)`;

    const {
        componentId,
        composedGestures,
        animatedContainerStyle,
        animatedTextStyle,
    } = useLedAnimations({
        text: settings.text,
        speed: settings.speed,
        isReverseScroll: settings.isReverseScroll,
        isTextBlinking: settings.isTextBlinking,
        currentHsl,
        onDoubleTap: () => setModalVisible(true),
    });

    if (!isLoaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00d4ff"/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <GestureDetector gesture={composedGestures}>
                <View style={styles.interactiveArea} testID="interactive-view">

                    <View style={[styles.ledBorder, {borderColor: currentHsl}]}>
                        <LedBorder
                            color={currentHsl}
                            isAnimating={settings.showBorder}
                            speed={settings.speed}
                        />

                        <View style={styles.ledDisplay}>
                            <View style={styles.gridOverlay} pointerEvents="none"/>

                            <Animated.View style={[styles.scroller, animatedContainerStyle]}>
                                {copiesArray.map((_, index) => (
                                    <React.Fragment key={`${componentId}-text-copy-${index}`}>
                                        <Animated.Text style={[styles.textBase, animatedTextStyle]}>
                                            {settings.text ? settings.text : ' '}
                                        </Animated.Text>
                                    </React.Fragment>
                                ))}
                            </Animated.View>
                        </View>
                    </View>

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
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                text={settings.text}
                onTextChange={settings.onTextChange}
                speed={settings.speed}
                onSpeedChange={settings.onSpeedChange}
                selectedColor={settings.selectedColor}
                onColorChange={settings.onColorChange}
                showBorder={settings.showBorder}
                onToggleBorder={settings.onToggleBorder}
                isBorderChase={settings.isBorderChase}
                onToggleBorderChase={settings.onToggleBorderChase}
                isBorderBlinking={settings.isBorderBlinking}
                onToggleBorderBlinking={settings.onToggleBorderBlinking}
                isLandscapeLocked={settings.isLandscapeLocked}
                onToggleOrientation={settings.onToggleOrientation}
                isTextBlinking={settings.isTextBlinking}
                onToggleTextBlinking={settings.onToggleTextBlinking}
                isReverseScroll={settings.isReverseScroll}
                onToggleReverseScroll={settings.onToggleReverseScroll}
                recentMessages={settings.recentMessages}
                favoriteMessages={settings.favoriteMessages}
                onSelectRecentMessage={settings.onSelectRecentMessage}
                onToggleFavorite={settings.onToggleFavorite}
            />
        </View>
    );
};

export default LedScroller;
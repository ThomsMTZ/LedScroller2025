import React from 'react';
import {StatusBar, Text, useWindowDimensions, View,} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient';
import {styles} from '../styles';
import {LedScrollerProps} from '../types';
import {COLORS} from '../constants';
import HintContainer from '../ui/HintContainer';
import SettingsModal from '../SettingsModal/SettingsModal';
import {useSettings} from '../../context/SettingsContext';
import {useLedAnimation} from '../hooks/useLedAnimation';
import LedDisplayPanel from './LedDisplayPanel';
import SettingsButton from '../ui/SettingsButton';
import AdBanner from '../ui/AdBanner';
import {LanguageButton} from '../ui/LanguageButton';
import {useTranslation} from '../../context/I18nContext';

const LedScroller: React.FC<LedScrollerProps> = ({initialText = 'Hello World'}) => {
    const {width, height} = useWindowDimensions();
    const isLandscape = width > height;
    const {t} = useTranslation();


    const settings = useSettings();

    // --- Animation ---
    const animation = useLedAnimation({
        text: settings.text,
        speed: settings.speed,
        isReverseScroll: settings.isReverseScroll,
        isTextBlinking: settings.isTextBlinking,
        isBorderBlinking: settings.isBorderBlinking,
        selectedColor: settings.selectedColor,
        borderColor: settings.borderColor,
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
                    <View style={{flex: 1}}>
                        <Text style={styles.headerTitle}>{t.appTitle}</Text>
                        <Text style={styles.headerSubtitle}>{t.appSubtitle}</Text>
                    </View>
                    <LanguageButton />
                    <View style={{width: 8}} />
                    <SettingsButton variant="portrait" onPress={settings.onOpenSettings} />
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
                        layout={{isLandscape, showNativeBorder, isChaseActive}}
                        animation={animation}
                        display={{text: settings.text, speed: settings.speed, thickness: settings.thickness}}
                    />

                    {!isLandscape && <HintContainer/>}
                </View>
            </GestureDetector>

            {!isLandscape && <AdBanner />}


            {!isLandscape && (
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{t.footerText}</Text>
                </View>
            )}

            <SettingsModal
                fontSize={animation.fontSizeState}
                maxFontSize={animation.maxFontSize}
                minFontSize={animation.minFontSize}
                onFontSizeChange={animation.setFontSize}
                onFontSizeChangeEnd={animation.setFontSizeEnd}
            />

            {isLandscape && <SettingsButton variant="landscape" onPress={settings.onOpenSettings} />}
        </View>
    );
};

export default LedScroller;
import React from 'react';
import {styles} from "../styles";
import {Text, View} from "react-native";
import Slider from "@react-native-community/slider";
import {COLORS} from "../../constants";
import {useSettings} from "../../../context/SettingsContext";
import {useTranslation} from "../../../context/I18nContext";

export const SpeedSection: React.FC = () => {
    const {speed, onSpeedChange, currentHsl} = useSettings();
    const {t} = useTranslation();

    return (
        <View style={styles.section}>
            <Text style={styles.label}>{t.speedLabel}</Text>
            <View style={styles.sliderContainer}>
                <Slider
                    testID="speed-slider"
                    style={{width: '100%', height: 40}}
                    minimumValue={20}
                    maximumValue={800}
                    step={20}
                    value={speed}
                    onSlidingComplete={onSpeedChange}
                    minimumTrackTintColor={currentHsl}
                    maximumTrackTintColor={COLORS.border}
                    thumbTintColor={currentHsl}
                />
                <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>{t.speedSlow}</Text>
                    <Text style={styles.sliderLabel}>{t.speedFast}</Text>
                </View>
            </View>
        </View>
    );
};

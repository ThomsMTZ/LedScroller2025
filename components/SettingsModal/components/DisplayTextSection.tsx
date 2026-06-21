import {Text, View} from "react-native";
import {styles} from "../styles";
import React from "react";
import {ToggleButton} from "./ToggleButton";
import {useSettings} from "../../../context/SettingsContext";
import {useTranslation} from "../../../context/I18nContext";

export const DisplayTextSection: React.FC = () => {

    const {currentHsl, isTextBlinking, onToggleTextBlinking, isReverseScroll, onToggleReverseScroll} = useSettings();
    const {t} = useTranslation();

    return (
        <View style={styles.section}>
            <Text style={styles.label}>{t.textEffectsLabel}</Text>
            <ToggleButton
                label={isTextBlinking ? t.textBlink : t.textFixed}
                icon={'flash'}
                isActive={isTextBlinking}
                onPress={onToggleTextBlinking}
                testID={'blink-text-button'}
                currentHsl={currentHsl}
            />
            <ToggleButton
                label={isReverseScroll ? t.directionLTR : t.directionRTL}
                icon={'swap-horizontal'}
                isActive={isReverseScroll}
                onPress={onToggleReverseScroll}
                testID={'direction-button'}
                currentHsl={currentHsl}
            />
        </View>
    );
};
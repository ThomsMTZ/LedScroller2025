import {styles} from "../styles";
import {Text, View} from "react-native";
import React from "react";
import {ToggleButton} from "./ToggleButton";
import {useSettings} from "../../../context/SettingsContext";
import {useTranslation} from "../../../context/I18nContext";

export const OrientationSection: React.FC = () => {

    const {isLandscapeLocked, onToggleOrientation, currentHsl} = useSettings();
    const {t} = useTranslation();
    return (
        <View style={styles.section}>
            <Text style={styles.label}>{t.orientationLabel}</Text>
            <ToggleButton
                label={isLandscapeLocked ? t.orientationLocked : t.orientationAuto}
                icon={'lock-closed'}
                isActive={isLandscapeLocked}
                onPress={onToggleOrientation}
                testID={'orientation-button'}
                currentHsl={currentHsl}
            />
        </View>
    );
};
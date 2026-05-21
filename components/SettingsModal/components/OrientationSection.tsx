import {styles} from "../styles";
import {Text, View} from "react-native";
import React from "react";
import {ToggleButton} from "./ToggleButton";
import {useSettings} from "../../../context/SettingsContext";

export const OrientationSection: React.FC = () => {

    const {isLandscapeLocked, onToggleOrientation, currentHsl} = useSettings();
    return (
        <View style={styles.section}>
            <Text style={styles.label}>🔄 Orientation & Direction</Text>
            <ToggleButton
                label={isLandscapeLocked ? 'Mode Paysage Forcé' : 'Rotation Automatique'}
                icon={'lock-closed'}
                isActive={isLandscapeLocked}
                onPress={onToggleOrientation}
                testID={'orientation-button'}
                currentHsl={currentHsl}
            />
        </View>
    );
};
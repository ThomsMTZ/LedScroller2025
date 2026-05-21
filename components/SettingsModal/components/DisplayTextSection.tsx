import {Text, View} from "react-native";
import {styles} from "../styles";
import React from "react";
import {ToggleButton} from "./ToggleButton";
import {useSettings} from "../../../context/SettingsContext";

export const DisplayTextSection: React.FC = () => {

    const {currentHsl, isTextBlinking, onToggleTextBlinking, isReverseScroll, onToggleReverseScroll} = useSettings();

    return (
        <View style={styles.section}>
            <Text style={styles.label}>✨ Effets Texte</Text>
            <ToggleButton
                label={isTextBlinking ? 'Texte : Clignotant' : 'Texte : Fixe'}
                icon={'flash'}
                isActive={isTextBlinking}
                onPress={onToggleTextBlinking}
                testID={'blink-text-button'}
                currentHsl={currentHsl}
            />
            <ToggleButton
                label={isReverseScroll ? 'Direction : Gauche vers Droite' : 'Direction : Droite vers Gauche'}
                icon={'swap-horizontal'}
                isActive={isReverseScroll}
                onPress={onToggleReverseScroll}
                testID={'direction-button'}
                currentHsl={currentHsl}
            />
        </View>
    );
};
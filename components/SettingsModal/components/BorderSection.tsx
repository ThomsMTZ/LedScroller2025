import React from "react";
import {styles} from "../../styles";
import {Text, View} from "react-native";
import {ToggleButton} from "./ToggleButton";
import {useSettings} from "../../../context/SettingsContext";

export const BorderSection: React.FC = () => {

    const {
        showBorder,
        isBorderChase,
        isBorderBlinking,
        onToggleBorder,
        onToggleBorderChase,
        onToggleBorderBlinking,
        currentHsl
    } = useSettings();

    return (
        <View style={styles.section}>
            <Text style={styles.label}>🖼️ Cadre LED</Text>
            <ToggleButton
                label={showBorder ? 'Bordure affichée' : 'Bordure masquée'}
                icon={'square'}
                isActive={showBorder}
                onPress={onToggleBorder}
                testID={'border-button'}
                currentHsl={currentHsl}
            />
            {showBorder && (
                <>
                    <ToggleButton
                        label={isBorderChase ? 'Style : Chenillard' : 'Style : Fixe'}
                        icon={'infinite'}
                        isActive={isBorderChase}
                        onPress={onToggleBorderChase}
                        testID={'chase-border-button'}
                        currentHsl={currentHsl}
                    />

                    <ToggleButton
                        label={isBorderBlinking ? 'Effet : Clignotant' : 'Effet : Constant'}
                        icon={'flash'}
                        isActive={isBorderBlinking}
                        onPress={onToggleBorderBlinking}
                        testID={'blink-border-button'}
                        currentHsl={currentHsl}
                    />
                </>
            )}
        </View>
    );
};
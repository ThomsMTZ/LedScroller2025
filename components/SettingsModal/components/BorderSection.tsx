import React from "react";
import {styles} from "../styles";
import {Text, View} from "react-native";
import {ToggleButton} from "./ToggleButton";
import {useSettings} from "../../../context/SettingsContext";
import {useTranslation} from "../../../context/I18nContext";

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
    const {t} = useTranslation();

    return (
        <View style={styles.section}>
            <Text style={styles.label}>{t.borderLabel}</Text>
            <ToggleButton
                label={showBorder ? t.borderShown : t.borderHidden}
                icon={'square'}
                isActive={showBorder}
                onPress={onToggleBorder}
                testID={'border-button'}
                currentHsl={currentHsl}
            />
            {showBorder && (
                <>
                    <ToggleButton
                        label={isBorderChase ? t.borderStyleChase : t.borderStyleFixed}
                        icon={'infinite'}
                        isActive={isBorderChase}
                        onPress={onToggleBorderChase}
                        testID={'chase-border-button'}
                        currentHsl={currentHsl}
                    />

                    <ToggleButton
                        label={isBorderBlinking ? t.borderEffectBlink : t.borderEffectConstant}
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
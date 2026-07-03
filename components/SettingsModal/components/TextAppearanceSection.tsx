import React from 'react';
import {styles} from "../styles";
import {Text, View, TouchableOpacity} from "react-native";
import Slider from "@react-native-community/slider";
import {COLORS} from "../../constants";
import {useSettings} from "../../../context/SettingsContext";
import {SettingsModalProps} from "../types";
import {useTranslation} from "../../../context/I18nContext";
import {Ionicons} from "@expo/vector-icons";

export const TextAppearanceSection: React.FC<SettingsModalProps> = (props) => {
    const {fontSize, maxFontSize, minFontSize, onFontSizeChange, onFontSizeChangeEnd} = props;
    const {thickness, onThicknessChange, currentHsl} = useSettings();
    const {t} = useTranslation();

    const changeFontSize = (delta: number) => {
        const newSize = Math.max(minFontSize, Math.min(maxFontSize, (fontSize || 200) + delta));
        onFontSizeChange(newSize);
        onFontSizeChangeEnd(newSize);
    };

    const changeThickness = (delta: number) => {
        onThicknessChange(Math.max(100, Math.min(900, (thickness || 900) + delta)));
    };

    return (
        <View>
            <View style={{ marginBottom: 20 }}>
                <Text style={[styles.label, { fontSize: 14, color: COLORS.textMuted }]}>{t.textSizeLabel}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => changeFontSize(-20)} style={{ padding: 10 }}>
                        <Ionicons name="remove" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Slider
                        testID="size-slider"
                        style={{flex: 1, height: 40}}
                        minimumValue={minFontSize}
                        maximumValue={maxFontSize}
                        step={10}
                        value={fontSize || 200}
                        onValueChange={onFontSizeChange}
                        onSlidingComplete={onFontSizeChangeEnd}
                        minimumTrackTintColor={currentHsl}
                        maximumTrackTintColor={COLORS.border}
                        thumbTintColor={currentHsl}
                    />
                    <TouchableOpacity onPress={() => changeFontSize(20)} style={{ padding: 10 }}>
                        <Ionicons name="add" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text style={[styles.label, { fontSize: 14, color: COLORS.textMuted }]}>{t.textThicknessLabel}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => changeThickness(-100)} style={{ padding: 10 }}>
                        <Ionicons name="remove" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Slider
                        testID="thickness-slider"
                        style={{flex: 1, height: 40}}
                        minimumValue={100}
                        maximumValue={900}
                        step={100}
                        value={thickness}
                        onValueChange={onThicknessChange}
                        minimumTrackTintColor={currentHsl}
                        maximumTrackTintColor={COLORS.border}
                        thumbTintColor={currentHsl}
                    />
                    <TouchableOpacity onPress={() => changeThickness(100)} style={{ padding: 10 }}>
                        <Ionicons name="add" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

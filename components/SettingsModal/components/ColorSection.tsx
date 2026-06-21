import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../styles';
import {LED_COLORS} from '../../constants';
import {useSettings} from "../../../context/SettingsContext";
import {useTranslation} from "../../../context/I18nContext";

const ColorSection: React.FC = () => {
    const {selectedColor, onColorChange} = useSettings();
    const {t} = useTranslation();
    return (
        <View style={styles.section}>
            <Text style={styles.label}>{t.colorLabel}</Text>

            <View style={styles.colorGrid}>
                {LED_COLORS.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    const hslString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;

                    return (
                        <TouchableOpacity
                            key={color.name}
                            style={[
                                styles.colorButton,
                                isSelected && styles.colorButtonSelected,
                                isSelected && {borderColor: hslString}
                            ]}
                            onPress={() => onColorChange(color)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.colorDot,
                                {
                                    backgroundColor: hslString,
                                    shadowColor: hslString,
                                    borderWidth: color.name === 'Blanc' ? 1 : 0,
                                    borderColor: '#ccc'
                                }
                            ]}/>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default ColorSection;
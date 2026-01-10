// components/ColorSelector.tsx
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {ColorSelectorProps} from './types';
import {LED_COLORS} from './constants';

const ColorSelector: React.FC<ColorSelectorProps> = ({selectedColor, onColorChange}) => {
    return (
        <View style={styles.colorGrid}>
            {LED_COLORS.map((color, index) => {
                const isSelected = selectedColor.name === color.name;
                const hslString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;

                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.colorButton,
                            isSelected && styles.colorButtonSelected,
                            isSelected && { borderColor: hslString }
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
    );
};

export default ColorSelector;
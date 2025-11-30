import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {ColorSelectorProps} from './types';
import {LED_COLORS} from './constants';

const ColorSelector: React.FC<ColorSelectorProps> = ({selectedHue, onHueChange}) => {
    return (
        <View style={styles.colorGrid}>
            {LED_COLORS.map((color) => (
                <TouchableOpacity
                    key={color.hue}
                    style={[
                        styles.colorButton,
                        selectedHue === color.hue && styles.colorButtonSelected,
                        selectedHue === color.hue && {
                            borderColor: `hsl(${color.hue}, 100%, 50%)`,
                        }
                    ]}
                    onPress={() => onHueChange(color.hue)}
                    activeOpacity={0.7}
                >
                    <View style={[
                        styles.colorDot,
                        {
                            backgroundColor: `hsl(${color.hue}, 100%, 50%)`,
                            shadowColor: `hsl(${color.hue}, 100%, 50%)`,
                        }
                    ]}/>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ColorSelector;

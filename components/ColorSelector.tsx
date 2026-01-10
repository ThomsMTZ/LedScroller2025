import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {ColorSelectorProps} from './types';

const ColorSelector: React.FC<ColorSelectorProps> = ({selectedHue, onHueChange}) => {
    const hueOptions = [0, 120, 240, 60, 300];

    return (
        <View style={styles.colorRow}>
            {hueOptions.map((h) => (
                <TouchableOpacity
                    key={h}
                    style={[
                        styles.colorDot,
                        {
                            backgroundColor: `hsl(${h}, 100%, 50%)`,
                            borderWidth: selectedHue === h ? 2 : 0
                        }
                    ]}
                    onPress={() => onHueChange(h)}
                />
            ))}
        </View>
    );
};

export default ColorSelector;

import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles';
import ColorSelector from '../ColorSelector';
import {LedColorType} from '../types';

interface ColorSectionProps {
    selectedColor: LedColorType;
    onColorChange: (color: LedColorType) => void;
}

const ColorSection: React.FC<ColorSectionProps> = ({
    selectedColor,
    onColorChange
}) => {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>🎨 Couleur</Text>
            <ColorSelector
                selectedColor={selectedColor}
                onColorChange={onColorChange}
            />
        </View>
    );
};

export default ColorSection;

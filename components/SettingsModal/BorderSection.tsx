import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles';
import ToggleButton from './ToggleButton';

interface BorderSectionProps {
    showBorder: boolean;
    onToggleBorder: () => void;
    currentHsl: string;
}

const BorderSection: React.FC<BorderSectionProps> = ({
    showBorder,
    onToggleBorder,
    currentHsl
}) => {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>🖼️ Cadre LED</Text>
            <ToggleButton
                testID="border-button"
                iconTestID="border-icon"
                isActive={showBorder}
                activeLabel="Bordure affichée"
                inactiveLabel="Bordure masquée"
                activeIcon="square-outline"
                inactiveIcon="scan-outline"
                onPress={onToggleBorder}
                currentHsl={currentHsl}
            />
        </View>
    );
};

export default BorderSection;

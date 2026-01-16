import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles';
import ToggleButton from './ToggleButton';

interface OrientationSectionProps {
    isLandscapeLocked: boolean;
    onToggleOrientation: () => void;
    currentHsl: string;
}

const OrientationSection: React.FC<OrientationSectionProps> = ({
    isLandscapeLocked,
    onToggleOrientation,
    currentHsl
}) => {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>🔄 Orientation</Text>
            <ToggleButton
                testID="orientation-button"
                isActive={isLandscapeLocked}
                activeLabel="Mode Paysage Forcé"
                inactiveLabel="Rotation Automatique"
                activeIcon="lock-closed"
                inactiveIcon="phone-portrait-outline"
                onPress={onToggleOrientation}
                currentHsl={currentHsl}
            />
        </View>
    );
};

export default OrientationSection;

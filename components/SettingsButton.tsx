import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {styles} from './styles';
import {COLORS} from './constants';

interface SettingsButtonProps {
    onPress: () => void;
    variant: 'portrait' | 'landscape';
}

const SettingsButton: React.FC<SettingsButtonProps> = ({onPress, variant}) => {
    const isLandscape = variant === 'landscape';
    return (
        <TouchableOpacity
            testID="settings-button"
            style={isLandscape ? styles.settingsButtonLandscape : styles.settingsButton}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name="settings-outline"
                size={24}
                color={isLandscape ? 'rgba(255,255,255,0.5)' : COLORS.text}
            />
        </TouchableOpacity>
    );
};

export default SettingsButton;

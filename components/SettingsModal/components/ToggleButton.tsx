import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {styles} from '../styles';
import {COLORS} from '../../constants';

interface ToggleButtonProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    isActive: boolean;
    onPress: () => void;
    testID: string;
    currentHsl: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({label, icon, isActive, onPress, testID, currentHsl}) => (
    <TouchableOpacity
        testID={testID}
        style={[
            styles.input,
            {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: isActive ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                borderColor: isActive ? currentHsl : COLORS.border,
                marginBottom: 10
            }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={{color: isActive ? currentHsl : COLORS.textMuted, fontSize: 14, fontWeight: '600'}}>
            {label}
        </Text>
        <Ionicons name={isActive ? icon : `${icon}-outline`} size={20}
                  color={isActive ? currentHsl : COLORS.textMuted}/>
    </TouchableOpacity>
);
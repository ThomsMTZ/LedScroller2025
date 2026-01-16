import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {styles} from '../styles';
import {COLORS} from '../constants';

interface ToggleButtonProps {
    testID: string;
    isActive: boolean;
    activeLabel: string;
    inactiveLabel: string;
    activeIcon: keyof typeof Ionicons.glyphMap;
    inactiveIcon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    currentHsl: string;
    iconTestID?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
    testID,
    isActive,
    activeLabel,
    inactiveLabel,
    activeIcon,
    inactiveIcon,
    onPress,
    currentHsl,
    iconTestID
}) => {
    return (
        <TouchableOpacity
            testID={testID}
            style={[
                styles.input,
                {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isActive ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                    borderColor: isActive ? currentHsl : COLORS.border
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={{
                color: isActive ? currentHsl : COLORS.textMuted,
                fontSize: 14,
                fontWeight: '600'
            }}>
                {isActive ? activeLabel : inactiveLabel}
            </Text>
            <Ionicons
                testID={iconTestID}
                name={isActive ? activeIcon : inactiveIcon}
                size={20}
                color={isActive ? currentHsl : COLORS.textMuted}
            />
        </TouchableOpacity>
    );
};

export default ToggleButton;

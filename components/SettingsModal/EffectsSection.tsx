import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {styles} from '../styles';
import {COLORS} from '../constants';

interface EffectsSectionProps {
    isTextBlinking: boolean;
    onToggleTextBlinking: () => void;
    isBorderBlinking: boolean;
    onToggleBorderBlinking: () => void;
    currentHsl: string;
}

const EffectsSection: React.FC<EffectsSectionProps> = ({
    isTextBlinking,
    onToggleTextBlinking,
    isBorderBlinking,
    onToggleBorderBlinking,
    currentHsl
}) => {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>✨ Effets</Text>

            <TouchableOpacity
                testID="blink-text-button"
                style={[
                    styles.input,
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                        backgroundColor: isTextBlinking ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                        borderColor: isTextBlinking ? currentHsl : COLORS.border
                    }
                ]}
                onPress={onToggleTextBlinking}
                activeOpacity={0.7}
            >
                <Text style={{
                    color: isTextBlinking ? currentHsl : COLORS.textMuted,
                    fontSize: 14,
                    fontWeight: '600'
                }}>
                    {isTextBlinking ? 'Texte : Clignotant' : 'Texte : Fixe'}
                </Text>
                <Ionicons
                    name={isTextBlinking ? "flash" : "flash-outline"}
                    size={20}
                    color={isTextBlinking ? currentHsl : COLORS.textMuted}
                />
            </TouchableOpacity>

            <TouchableOpacity
                testID="blink-border-button"
                style={[
                    styles.input,
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: isBorderBlinking ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                        borderColor: isBorderBlinking ? currentHsl : COLORS.border
                    }
                ]}
                onPress={onToggleBorderBlinking}
                activeOpacity={0.7}
            >
                <Text style={{
                    color: isBorderBlinking ? currentHsl : COLORS.textMuted,
                    fontSize: 14,
                    fontWeight: '600'
                }}>
                    {isBorderBlinking ? 'Bordure : Clignotante' : 'Bordure : Fixe'}
                </Text>
                <Ionicons
                    name={isBorderBlinking ? "pulse" : "pulse-outline"}
                    size={20}
                    color={isBorderBlinking ? currentHsl : COLORS.textMuted}
                />
            </TouchableOpacity>
        </View>
    );
};

export default EffectsSection;

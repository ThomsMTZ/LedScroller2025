import React, { ReactNode, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

interface AccordionSectionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
    title,
    children,
    defaultOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const progress = useSharedValue(defaultOpen ? 1 : 0);

    const toggle = () => {
        const next = !isOpen;
        setIsOpen(next);
        progress.value = withTiming(next ? 1 : 0, { duration: 250 });
    };

    const chevronStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        maxHeight: interpolate(progress.value, [0, 1], [0, 2000]),
        overflow: 'hidden',
    }));

    return (
        <View style={styles.section}>
            <TouchableOpacity
                style={styles.header}
                onPress={toggle}
                activeOpacity={0.7}
            >
                <Text style={styles.label}>{title}</Text>
                <Animated.View style={chevronStyle}>
                    <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={contentStyle}>
                <View style={styles.content}>
                    {children}
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    label: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 4,
    },
});

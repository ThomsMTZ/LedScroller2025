import React from 'react';
import {Text, View} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons';
import {styles} from './styles';
import {COLORS} from './constants';

const HintContainer: React.FC = () => {
    return (
        <Animated.View
            style={styles.hintContainer}
            pointerEvents="none"
            entering={FadeIn.delay(500).duration(1000)}
        >
            <View style={styles.hintIcon}>
                <Ionicons name="hand-left-outline" size={14} color={COLORS.textMuted}/>
            </View>
            <Text style={styles.hintText}>Double-tap: Options</Text>
            <Text style={styles.hintText}>•</Text>
            <Text style={styles.hintText}>Pinch: Zoom</Text>
        </Animated.View>
    );
};

export default HintContainer;

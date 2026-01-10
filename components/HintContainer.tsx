import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './styles';
import {HintContainerProps} from './types';

const HintContainer: React.FC<HintContainerProps> = ({
    text = 'Double-tap: Options • Pinch: Zoom'
}) => {
    return (
        <View style={styles.hintContainer} pointerEvents="none">
            <Text style={styles.hintText}>{text}</Text>
        </View>
    );
};

export default HintContainer;

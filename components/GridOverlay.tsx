import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Mask } from 'react-native-svg';
import { styles } from './styles';

const GridOverlay: React.FC = () => {
    const PATTERN_SIZE = 6;
    const RADIUS = 2.5;

    return (
        <View style={styles.gridOverlay} pointerEvents="none">
            <Svg height="100%" width="100%">
                <Defs>
                    <Pattern
                        id="ledPattern"
                        x="0"
                        y="0"
                        width={PATTERN_SIZE}
                        height={PATTERN_SIZE}
                        patternUnits="userSpaceOnUse"
                    >
                        <Rect x="0" y="0" width={PATTERN_SIZE} height={PATTERN_SIZE} fill="white" />
                        <Circle cx={PATTERN_SIZE / 2} cy={PATTERN_SIZE / 2} r={RADIUS} fill="black" />
                    </Pattern>

                    <Mask id="ledMask">
                        <Rect x="0" y="0" width="100%" height="100%" fill="url(#ledPattern)" />
                    </Mask>
                </Defs>

                <Rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="black"
                    mask="url(#ledMask)"
                />
            </Svg>
        </View>
    );
};

export default GridOverlay;

import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import Svg, {Circle, Defs, Mask, Pattern, Rect} from 'react-native-svg';
import {styles} from './styles';

const GridOverlay: React.FC = () => {
    const { width, height } = useWindowDimensions();
    // Pre-calculate a size large enough to cover the screen in any orientation
    // For iPhone 8 this is around ~767px, which renders instantly compared to 4000px!
    const size = Math.max(width, height) + 100;
    
    const PATTERN_SIZE = 6;
    const RADIUS = 2.5;

    return (
        <View style={styles.gridOverlay} pointerEvents="none">
            <Svg height={size} width={size}>
                <Defs>
                    <Pattern
                        id="ledPattern"
                        x="0"
                        y="0"
                        width={PATTERN_SIZE}
                        height={PATTERN_SIZE}
                        patternUnits="userSpaceOnUse"
                    >
                        <Rect x="0" y="0" width={PATTERN_SIZE} height={PATTERN_SIZE} fill="white"/>
                        <Circle cx={PATTERN_SIZE / 2} cy={PATTERN_SIZE / 2} r={RADIUS} fill="black"/>
                    </Pattern>

                    <Mask id="ledMask">
                        <Rect x="0" y="0" width={size} height={size} fill="url(#ledPattern)"/>
                    </Mask>
                </Defs>

                <Rect
                    x="0"
                    y="0"
                    width={size}
                    height={size}
                    fill="black"
                    mask="url(#ledMask)"
                />
            </Svg>
        </View>
    );
};

export default GridOverlay;
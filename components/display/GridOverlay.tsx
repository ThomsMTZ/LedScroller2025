import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import Svg, {Defs, Pattern, Rect, Path} from 'react-native-svg';
import {styles} from '../styles';

const GridOverlay: React.FC = () => {
    const { width, height } = useWindowDimensions();
    // Pre-calculate a size large enough to cover the screen in any orientation
    const size = Math.max(width, height) + 100;
    
    const PATTERN_SIZE = 6;
    const RADIUS = 2.5;

    // Use a single path with evenodd fill rule to punch a hole in the rectangle.
    // This entirely avoids the extremely expensive <Mask> component.
    const cx = PATTERN_SIZE / 2;
    const cy = PATTERN_SIZE / 2;
    const pathData = `M 0,0 H ${PATTERN_SIZE} V ${PATTERN_SIZE} H 0 Z 
                      M ${cx},${cy - RADIUS} 
                      A ${RADIUS},${RADIUS} 0 1,0 ${cx},${cy + RADIUS} 
                      A ${RADIUS},${RADIUS} 0 1,0 ${cx},${cy - RADIUS}`;

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
                        <Path d={pathData} fill="black" fillRule="evenodd" />
                    </Pattern>
                </Defs>

                <Rect
                    x="0"
                    y="0"
                    width={size}
                    height={size}
                    fill="url(#ledPattern)"
                />
            </Svg>
        </View>
    );
};

export default GridOverlay;
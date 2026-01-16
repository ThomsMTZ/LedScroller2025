import React, {useEffect, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import Svg, {Rect} from 'react-native-svg';
import Animated, {
    cancelAnimation,
    Easing,
    SharedValue,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const TRAIL_LENGTH = 12;
const HEAD_SIZE = 30;
const SEGMENT_LAG = 5;

interface TrailSegmentProps {
    index: number;
    progress: SharedValue<number>;
    perimeter: number;
    rectW: number;
    rectH: number;
    halfWidth: number;
    borderRadius: number;
    color: string;
    borderWidth: number;
}

const TrailSegment: React.FC<TrailSegmentProps> = ({
                                                       index,
                                                       progress,
                                                       perimeter,
                                                       rectW,
                                                       rectH,
                                                       halfWidth,
                                                       borderRadius,
                                                       color,
                                                       borderWidth
                                                   }) => {
    const opacity = Math.max(0, 1 - (index / TRAIL_LENGTH));
    const lagOffset = index * SEGMENT_LAG;

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: progress.value + lagOffset,
        };
    });

    return (
        <AnimatedRect
            x={halfWidth}
            y={halfWidth}
            width={rectW > 0 ? rectW : 0}
            height={rectH > 0 ? rectH : 0}
            rx={borderRadius}
            ry={borderRadius}
            fill="none"
            stroke={color}
            strokeWidth={borderWidth}
            strokeOpacity={opacity}
            strokeDasharray={`${HEAD_SIZE}, ${perimeter}`}
            strokeLinecap="round"
            animatedProps={animatedProps}
        />
    );
};

interface LedBorderProps {
    color: string;
    isAnimating: boolean;
    borderWidth?: number;
    borderRadius?: number;
}

const LedBorder: React.FC<LedBorderProps> = ({
                                                 color,
                                                 isAnimating,
                                                 borderWidth = 4,
                                                 borderRadius = 16
                                             }) => {
    const [dims, setDims] = useState({width: 0, height: 0});
    const progress = useSharedValue(0);

    const perimeter = 2 * (dims.width + dims.height) - (8 * borderRadius) + (2 * Math.PI * borderRadius);

    useEffect(() => {
        if (isAnimating && perimeter > 0) {
            progress.value = withRepeat(
                withTiming(-perimeter, {
                    duration: 3000,
                    easing: Easing.linear,
                }),
                -1, false
            );
        } else {
            cancelAnimation(progress);
        }
        return () => cancelAnimation(progress);
    }, [isAnimating, perimeter]);

    const onLayout = (event: LayoutChangeEvent) => {
        setDims({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height
        });
    };

    if (dims.width === 0) return <View style={StyleSheet.absoluteFill} onLayout={onLayout}/>;

    const halfWidth = borderWidth / 2;
    const rectW = dims.width - borderWidth;
    const rectH = dims.height - borderWidth;

    const segmentIndices = Array.from({length: TRAIL_LENGTH}).map((_, i) => i);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width={dims.width} height={dims.height}>
                {/* On ne rend les segments que si on anime. La bordure statique est gérée par le parent CSS. */}
                {isAnimating && segmentIndices.reverse().map((i) => (
                    <TrailSegment
                        key={i}
                        index={i}
                        progress={progress}
                        perimeter={perimeter}
                        rectW={rectW}
                        rectH={rectH}
                        halfWidth={halfWidth}
                        borderRadius={borderRadius}
                        color={color}
                        borderWidth={borderWidth}
                    />
                ))}
            </Svg>
        </View>
    );
};

export default LedBorder;
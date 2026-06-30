import React, {useEffect} from 'react';
import {useWindowDimensions, View} from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    SharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';
import {ANIMATION_DURATIONS} from './constants';

// Permet de passer des animatedProps à LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface LedBorderProps {
    /** SharedValue<string> de la couleur HSL — calculée dans un worklet, jamais pendant le render. */
    colorShared: SharedValue<string>;
    isAnimating: boolean;
    speed: number;
}

const LedBorder: React.FC<LedBorderProps> = ({colorShared, isAnimating, speed}) => {
    const rotation = useSharedValue(0);
    const {width, height} = useWindowDimensions();
    const size = Math.max(width, height) * 2.5;

    useEffect(() => {
        if (isAnimating) {
            const animationDuration = Math.max(
                ANIMATION_DURATIONS.chaseMin,
                ANIMATION_DURATIONS.chaseSpeedMultiplier / (speed > 0 ? speed : 1)
            );
            const currentRotation = rotation.value % 360;
            rotation.value = currentRotation;

            rotation.value = withRepeat(
                withTiming(currentRotation + 360, {
                    duration: animationDuration,
                    easing: Easing.linear,
                }),
                -1,
                false
            );
        } else {
            cancelAnimation(rotation);
        }

        return () => cancelAnimation(rotation);
    }, [isAnimating, speed, rotation]);

    const animatedRotationStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${rotation.value}deg`}],
    }));

    // Couleur lue dans un worklet via useAnimatedProps — pas pendant le render React.
    const animatedGradientProps = useAnimatedProps(() => ({
        colors: [colorShared.value, 'transparent'] as [string, string],
    }));

    if (!isAnimating) return null;

    return (
        <Animated.View style={[
            {
                position: 'absolute',
                width: size,
                height: size,
                top: '50%',
                left: '50%',
                marginTop: -size / 2,
                marginLeft: -size / 2,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: -1,
            },
            animatedRotationStyle,
        ]}>
            <View style={{width: '100%', height: '50%', flexDirection: 'row'}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}/>
                <AnimatedLinearGradient
                    animatedProps={animatedGradientProps}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0.5}}
                    style={{flex: 1}}
                />
            </View>
            <View style={{width: '100%', height: '50%', backgroundColor: 'transparent'}}/>
        </Animated.View>
    );
};

export default LedBorder;
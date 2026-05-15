import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';

interface LedBorderProps {
    color: string;
    isAnimating: boolean;
}

const LedBorder: React.FC<LedBorderProps> = ({color, isAnimating}) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (isAnimating) {
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 2500,
                    easing: Easing.linear,
                }),
                -1,
                false
            );
        } else {
            cancelAnimation(rotation);
            rotation.value = 0;
        }
        return () => cancelAnimation(rotation);
    }, [isAnimating]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{rotate: `${rotation.value}deg`}],
        };
    });

    if (!isAnimating) return null;

    return (
        <Animated.View style={[
            {
                position: 'absolute',
                width: '300%',
                height: '300%',
                top: '-100%',
                left: '-100%',
                justifyContent: 'center',
                alignItems: 'center'
            },
            animatedStyle
        ]}>
            <View style={{width: '100%', height: '50%', flexDirection: 'row'}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}/>

                <LinearGradient
                    colors={[color, 'transparent']}
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
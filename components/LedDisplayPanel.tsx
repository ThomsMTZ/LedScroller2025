import React from 'react';
import Animated, {AnimatedStyle, SharedValue} from 'react-native-reanimated';
import {StyleSheet, TextStyle, useWindowDimensions, View, ViewStyle} from 'react-native';
import {styles} from './styles';
import GridOverlay from './GridOverlay';
import LedBorder from './LedBorder';
import {buildHslString} from '../utils/colorUtils';

interface LedDisplayPanelProps {
    isLandscape: boolean;
    showNativeBorder: boolean;
    isChaseActive: boolean;
    PORTRAIT_PANEL_HEIGHT: number;
    animatedBorderColorStyle: AnimatedStyle<ViewStyle>;
    animatedBorderOpacityStyle: AnimatedStyle<ViewStyle>;
    animatedShadowColorStyle: AnimatedStyle<ViewStyle>;
    animatedContainerStyle: AnimatedStyle<ViewStyle>;
    animatedTextStyle: AnimatedStyle<TextStyle>;
    hueVal: SharedValue<number>;
    satVal: SharedValue<number>;
    ligVal: SharedValue<number>;
    speed: number;
    componentId: string;
    text: string;
    setTextWidth: (width: number) => void;
    copiesArray: unknown[];
    LOOP_SPACING: number;
}

const LedDisplayPanel: React.FC<LedDisplayPanelProps> = ({
                                                             isLandscape,
                                                             showNativeBorder,
                                                             isChaseActive,
                                                             PORTRAIT_PANEL_HEIGHT,
                                                             animatedBorderColorStyle,
                                                             animatedBorderOpacityStyle,
                                                             animatedShadowColorStyle,
                                                             animatedContainerStyle,
                                                             animatedTextStyle,
                                                             hueVal,
                                                             satVal,
                                                             ligVal,
                                                             speed,
                                                             componentId,
                                                             text,
                                                             setTextWidth,
                                                             copiesArray,
                                                             LOOP_SPACING,
                                                         }) => {
    const {width} = useWindowDimensions();

    const getDisplayBorderRadius = (): number => {
        if (isLandscape) return 0;
        if (isChaseActive) return 12;
        return 16;
    };

    return (
        <Animated.View
            testID="led-display"
            style={[
                styles.ledDisplay,
                animatedBorderColorStyle,
                {
                    borderWidth: showNativeBorder ? 4 : 0,
                    backgroundColor: isChaseActive ? '#050505' : 'black',
                    height: isLandscape ? '100%' : PORTRAIT_PANEL_HEIGHT,
                    overflow: 'hidden',
                    position: 'relative',
                },
                isLandscape && {
                    flex: 1, width: '100%', height: '100%',
                    borderRadius: 0, padding: 0,
                    borderWidth: showNativeBorder ? 4 : 0,
                    backgroundColor: isChaseActive ? '#050505' : 'black',
                },
            ]}
        >
            {isChaseActive && (
                <Animated.View style={[
                    StyleSheet.absoluteFill,
                    animatedBorderOpacityStyle,
                    {overflow: 'hidden', borderRadius: isLandscape ? 0 : 16},
                ]}>
                    <LedBorder
                        color={buildHslString(hueVal.value, satVal.value, ligVal.value)}
                        isAnimating={true}
                        speed={speed}
                    />
                </Animated.View>
            )}

            <Animated.View style={[
                styles.ledBorder,
                animatedShadowColorStyle,
                {
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.8,
                    shadowRadius: 20,
                    backgroundColor: '#0a0a0a',
                    flex: 1,
                    margin: isChaseActive ? 4 : 0,
                    borderRadius: getDisplayBorderRadius(),
                    justifyContent: 'center',
                    paddingVertical: 0,
                },
                !isChaseActive && {width: '100%'},
                isLandscape && {
                    flex: 1,
                    borderRadius: 0,
                    paddingVertical: 0,
                    justifyContent: 'center',
                    margin: isChaseActive ? 4 : 0,
                },
            ]}>
                <Animated.View
                    testID="scrolling-container"
                    style={[
                        styles.scroller,
                        {
                            minWidth: width * 2,
                            alignSelf: 'flex-start',
                            flexDirection: 'row',
                            alignItems: 'center',
                        },
                        animatedContainerStyle,
                    ]}
                >
                    {copiesArray.map((_, index) => (
                        <React.Fragment key={`${componentId}-text-copy-${index}`}>
                            <Animated.Text
                                testID="scrolling-text"
                                onLayout={index === 0
                                    ? (e) => setTextWidth(e.nativeEvent.layout.width)
                                    : undefined}
                                style={[styles.textBase, animatedTextStyle]}
                                numberOfLines={1}
                                ellipsizeMode="clip"
                            >
                                {text}
                            </Animated.Text>
                            <View style={{width: LOOP_SPACING}}/>
                        </React.Fragment>
                    ))}
                </Animated.View>
                <GridOverlay/>
            </Animated.View>
        </Animated.View>
    );
};

export default LedDisplayPanel;
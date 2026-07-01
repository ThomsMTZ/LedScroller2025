import React from 'react';
import Animated, {AnimatedStyle, SharedValue} from 'react-native-reanimated';
import {StyleSheet, TextStyle, useWindowDimensions, View, ViewStyle} from 'react-native';
import {styles} from './styles';
import GridOverlay from './GridOverlay';
import LedBorder from './LedBorder';

// --- Sous-interfaces groupées ---

interface LedLayoutProps {
    isLandscape: boolean;
    showNativeBorder: boolean;
    isChaseActive: boolean;
}

interface LedAnimationStyles {
    PORTRAIT_PANEL_HEIGHT: number;
    animatedBorderColorStyle: AnimatedStyle<ViewStyle>;
    animatedBorderOpacityStyle: AnimatedStyle<ViewStyle>;
    animatedShadowColorStyle: AnimatedStyle<ViewStyle>;
    animatedContainerStyle: AnimatedStyle<ViewStyle>;
    animatedTextStyle: AnimatedStyle<TextStyle>;
    componentId: string;
    setTextWidth: (width: number) => void;
    copiesArray: unknown[];
    LOOP_SPACING: number;
    textWidth: number;
    /** Couleur HSL dérivée dans un worklet — jamais lue pendant le render React. */
    ledColorShared: SharedValue<string>;
}

interface LedDisplayProps {
    text: string;
    speed: number;
    thickness: number;
}

interface LedDisplayPanelProps {
    layout: LedLayoutProps;
    animation: LedAnimationStyles;
    display: LedDisplayProps;
}

const LedDisplayPanel: React.FC<LedDisplayPanelProps> = ({layout, animation, display}) => {
    const {isLandscape, showNativeBorder, isChaseActive} = layout;
    const {
        PORTRAIT_PANEL_HEIGHT,
        animatedBorderColorStyle,
        animatedBorderOpacityStyle,
        animatedShadowColorStyle,
        animatedContainerStyle,
        animatedTextStyle,
        componentId,
        copiesArray,
        LOOP_SPACING,
        ledColorShared,
    } = animation;
    const {text, speed, thickness = 900} = display;

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
                isLandscape && {flex: 1, width: '100%', borderRadius: 0, padding: 0},
            ]}
        >
            {isChaseActive && (
                <Animated.View style={[
                    StyleSheet.absoluteFill,
                    animatedBorderOpacityStyle,
                    {overflow: 'hidden', borderRadius: isLandscape ? 0 : 16},
                ]}>
                    <LedBorder
                        colorShared={ledColorShared}
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
                },
                !isChaseActive && {width: '100%'},
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
                    {/*
                     * Wrapper de mesure — width:9999 donne au Text 9999px d'espace disponible,
                     * lui permettant de mesurer sa VRAIE largeur naturelle (non contrainte
                     * par le layout flex du parent, dont la containing-block-width = screenWidth).
                     * Position absolute : hors du flux flex, n'affecte pas la mise en page.
                     */}
                    <View
                        pointerEvents="none"
                        style={styles.measureWrapper}
                    >
                        <Animated.Text
                            style={[
                                styles.textBase,
                                {
                                    fontSize: animation.fontSizeState,
                                    fontWeight: thickness.toString() as any,
                                    alignSelf: 'flex-start',
                                    textAlign: 'left',
                                }
                            ]}
                            onLayout={(e) => animation.setTextWidth(e.nativeEvent.layout.width)}
                        >
                            {text}
                        </Animated.Text>
                    </View>

                    {copiesArray.map((_, index) => (
                        <React.Fragment key={`${componentId}-text-copy-${index}`}>
                            <View style={{ width: animation.textWidth > 0 ? animation.textWidth : undefined, overflow: 'visible' }}>
                                <Animated.Text
                                    testID="scrolling-text"
                                    style={[
                                        styles.textBase,
                                        animatedTextStyle,
                                        { textAlign: 'left', width: 9999, fontWeight: thickness.toString() as any }
                                    ]}
                                >
                                    {text}
                                </Animated.Text>
                            </View>
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
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {LinearGradient} from 'expo-linear-gradient';
import {LedColorType} from '../../types';
import {COLORS} from '../../constants';

interface RainbowColorPickerProps {
    color: LedColorType;
    onChange: (color: LedColorType) => void;
}

// Couleurs du dégradé arc-en-ciel (rouge → orange → jaune → vert → cyan → bleu → violet → rose → rouge)
const RAINBOW_COLORS = [
    '#FF0000', // Hue 0   — Rouge
    '#FF8000', // Hue 30  — Orange
    '#FFFF00', // Hue 60  — Jaune
    '#00FF00', // Hue 120 — Vert
    '#00FFFF', // Hue 180 — Cyan
    '#0080FF', // Hue 210 — Bleu
    '#8000FF', // Hue 270 — Violet
    '#FF00FF', // Hue 300 — Magenta
    '#FF0080', // Hue 330 — Rose
    '#FF0000', // Hue 360 — Rouge (boucle)
] as const;

export const RainbowColorPicker: React.FC<RainbowColorPickerProps> = ({color, onChange}) => {
    const previewHsl = `hsl(${color.hue}, 100%, 50%)`;

    const handleHueChange = (hue: number) => {
        onChange({
            hue: Math.round(hue),
            saturation: 100,
            lightness: 50,
            name: 'Custom',
        });
    };

    return (
        <View style={styles.container}>
            {/* Aperçu de la couleur */}
            <View style={styles.previewRow}>
                <View
                    style={[
                        styles.previewDot,
                        {
                            backgroundColor: previewHsl,
                            shadowColor: previewHsl,
                        },
                    ]}
                />
            </View>

            {/* Slider arc-en-ciel */}
            <View style={styles.sliderWrapper}>
                <LinearGradient
                    colors={RAINBOW_COLORS}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.rainbowGradient}
                    pointerEvents="none"
                />
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={360}
                    step={1}
                    value={color.hue}
                    onValueChange={handleHueChange}
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor="transparent"
                    thumbTintColor={previewHsl}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
    },
    previewRow: {
        alignItems: 'center',
        marginBottom: 12,
    },
    previewDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 6,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    sliderWrapper: {
        position: 'relative',
        justifyContent: 'center',
        height: 44,
    },
    rainbowGradient: {
        position: 'absolute',
        left: 12,
        right: 12,
        height: 12,
        borderRadius: 6,
    },
    slider: {
        width: '100%',
        height: 44,
    },
});

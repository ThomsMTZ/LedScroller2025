import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import Slider from '@react-native-community/slider';
import {Ionicons} from '@expo/vector-icons';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {styles} from './styles';
import {SettingsModalProps} from './types';
import {COLORS} from './constants';
import ColorSelector from './ColorSelector';

const SettingsModal: React.FC<SettingsModalProps> = ({
                                                         visible,
                                                         onClose,
                                                         text,
                                                         onTextChange,
                                                         speed,
                                                         onSpeedChange,
                                                         selectedColor,
                                                         onColorChange,
                                                         isLandscapeLocked,
                                                         onToggleOrientation
                                                     }) => {

    const {height: screenHeight} = useWindowDimensions();

    const currentHsl = `hsl(${selectedColor.hue}, ${selectedColor.saturation}%, ${selectedColor.lightness}%)`;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* 1. KeyboardAvoidingView */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <View style={styles.modalOverlay}>

                    <TouchableOpacity
                        style={{flex: 1}}
                        activeOpacity={1}
                        onPress={onClose}
                    />

                    <Animated.View
                        style={[
                            styles.modalContent,
                            {maxHeight: screenHeight * 0.85}
                        ]}
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(200)}
                    >
                        {/* 3. ScrollView */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom: 20}}
                        >
                            <View style={styles.modalHandle}/>

                            <View style={styles.headerModal}>
                                <Text style={styles.modalTitle}>⚙️ Config</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={24} color={COLORS.text}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>💬 Message</Text>
                                <TextInput
                                    style={styles.input}
                                    value={text}
                                    onChangeText={onTextChange}
                                    placeholder="Entrez votre message..."
                                    placeholderTextColor={COLORS.textMuted}
                                    selectionColor={currentHsl}
                                />
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>⚡ Vitesse</Text>
                                <View style={styles.sliderContainer}>
                                    <Slider
                                        style={{width: '100%', height: 40}}
                                        minimumValue={20}
                                        maximumValue={800}
                                        step={20}
                                        value={speed}
                                        onSlidingComplete={onSpeedChange}
                                        minimumTrackTintColor={currentHsl}
                                        maximumTrackTintColor={COLORS.border}
                                        thumbTintColor={currentHsl}
                                    />
                                    <View style={styles.sliderLabels}>
                                        <Text style={styles.sliderLabel}>Lent</Text>
                                        <Text style={styles.sliderLabel}>Rapide</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>🔄 Orientation</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.input,
                                        {
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: isLandscapeLocked ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                                            borderColor: isLandscapeLocked ? currentHsl : COLORS.border
                                        }
                                    ]}
                                    onPress={onToggleOrientation}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{
                                        color: isLandscapeLocked ? currentHsl : COLORS.textMuted,
                                        fontSize: 14,
                                        fontWeight: '600'
                                    }}>
                                        {isLandscapeLocked ? 'Mode Paysage Forcé' : 'Rotation Automatique'}
                                    </Text>

                                    <Ionicons
                                        name={isLandscapeLocked ? "lock-closed" : "phone-portrait-outline"}
                                        size={20}
                                        color={isLandscapeLocked ? currentHsl : COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>🎨 Couleur</Text>
                                <ColorSelector
                                    selectedColor={selectedColor}
                                    onColorChange={onColorChange}
                                />
                            </View>

                        </ScrollView>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default SettingsModal;
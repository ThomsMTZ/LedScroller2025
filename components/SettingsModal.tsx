import React from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
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
    hue,
    onHueChange
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity 
                    style={{flex: 1}} 
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View 
                    style={styles.modalContent}
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(200)}
                >
                    {/* Modal Handle */}
                    <View style={styles.modalHandle}/>

                    <View style={styles.headerModal}>
                        <Text style={styles.modalTitle}>⚙️ Configuration</Text>
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
                            selectionColor={`hsl(${hue}, 100%, 50%)`}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>⚡ Vitesse de défilement</Text>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={{width: '100%', height: 40}}
                                minimumValue={10000}
                                maximumValue={1000}
                                value={speed}
                                onSlidingComplete={onSpeedChange}
                                minimumTrackTintColor={`hsl(${hue}, 100%, 50%)`}
                                maximumTrackTintColor={COLORS.border}
                                thumbTintColor={`hsl(${hue}, 100%, 60%)`}
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>Lent</Text>
                                <Text style={styles.sliderLabel}>Rapide</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>🎨 Couleur LED</Text>
                        <ColorSelector selectedHue={hue} onHueChange={onHueChange} />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default SettingsModal;

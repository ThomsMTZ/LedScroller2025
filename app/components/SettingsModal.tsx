import React from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {Ionicons} from '@expo/vector-icons';
import {styles} from './styles';
import {SettingsModalProps} from './types';
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
                <View style={styles.modalContent}>
                    <View style={styles.headerModal}>
                        <Text style={styles.modalTitle}>Configuration</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={onTextChange}
                        placeholder="Votre texte..."
                        placeholderTextColor="#666"
                    />

                    <Text style={styles.label}>Vitesse</Text>
                    <Slider
                        style={{width: '100%', height: 40}}
                        minimumValue={20000}
                        maximumValue={5000}
                        value={speed}
                        onSlidingComplete={onSpeedChange}
                        minimumTrackTintColor={`hsl(${hue}, 100%, 50%)`}
                        maximumTrackTintColor="#555"
                        thumbTintColor={`hsl(${hue}, 100%, 50%)`}
                    />

                    <Text style={styles.label}>Couleur LED</Text>
                    <ColorSelector selectedHue={hue} onHueChange={onHueChange} />
                </View>
            </View>
        </Modal>
    );
};

export default SettingsModal;

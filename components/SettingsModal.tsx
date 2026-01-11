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
                                                         onColorChange
                                                     }) => {
    // On récupère la hauteur de l'écran pour limiter la taille de la modale
    const {height: screenHeight} = useWindowDimensions();

    const currentHsl = `hsl(${selectedColor.hue}, ${selectedColor.saturation}%, ${selectedColor.lightness}%)`;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* 1. KeyboardAvoidingView : Empêche le clavier de masquer le champ texte */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <View style={styles.modalOverlay}>

                    {/* Zone transparente au-dessus pour fermer en cliquant */}
                    <TouchableOpacity
                        style={{flex: 1}}
                        activeOpacity={1}
                        onPress={onClose}
                    />

                    <Animated.View
                        style={[
                            styles.modalContent,
                            // 2. Contrainte de hauteur :
                            // On empêche la modale de dépasser 85% de l'écran (vital en paysage)
                            {maxHeight: screenHeight * 0.85}
                        ]}
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(200)}
                    >
                        {/* 3. ScrollView : Permet de faire défiler le contenu si ça dépasse */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom: 20}}
                        >
                            {/* La poignée visuelle */}
                            <View style={styles.modalHandle}/>

                            {/* L'En-tête avec le bouton Fermer (Toujours visible en haut du scroll) */}
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

                            {/* --- CONTENU --- */}

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
                                        minimumValue={10000}
                                        maximumValue={1000}
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
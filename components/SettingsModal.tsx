import React from 'react';
import {Modal, ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {Ionicons} from '@expo/vector-icons';
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
                                                         onToggleOrientation,
                                                         showBorder,
                                                         onToggleBorder,
                                                         isBorderChase,
                                                         onToggleBorderChase,
                                                         isBorderBlinking,
                                                         onToggleBorderBlinking,
                                                         isTextBlinking,
                                                         onToggleTextBlinking,
                                                         recentMessages,
                                                         onSelectRecentMessage
                                                     }) => {

    const {height: screenHeight} = useWindowDimensions();
    const currentHsl = `hsl(${selectedColor.hue}, ${selectedColor.saturation}%, ${selectedColor.lightness}%)`;

    // Helper pour créer un bouton toggle
    const renderToggleButton = (label: string, icon: any, isActive: boolean, onPress: () => void, testID: string) => (
        <TouchableOpacity
            testID={testID}
            style={[
                styles.input,
                {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isActive ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                    borderColor: isActive ? currentHsl : COLORS.border,
                    marginBottom: 10
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={{
                color: isActive ? currentHsl : COLORS.textMuted,
                fontSize: 14,
                fontWeight: '600'
            }}>
                {label}
            </Text>
            <Ionicons
                name={isActive ? icon : icon + "-outline"}
                size={20}
                color={isActive ? currentHsl : COLORS.textMuted}
            />
        </TouchableOpacity>
    );

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
                    testID="modal-overlay"
                />

                <View
                    style={[
                        styles.modalContent,
                        {maxHeight: screenHeight * 0.85}
                    ]}
                >
                    <View style={styles.modalHandle}/>

                    <View style={styles.headerModal}>
                        <Text style={styles.modalTitle}>⚙️ Config</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                            testID="close-modal-button"
                            accessibilityRole="button"
                            accessibilityLabel="Fermer"
                        >
                            <Ionicons name="close" size={24} color={COLORS.text}/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 20}}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* MESSAGE ET HISTORIQUE */}
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

                            {/* Historique des derniers messages */}
                            {recentMessages && recentMessages.length > 0 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.historyContainer}
                                >
                                    {recentMessages.map((msg, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.historyChip}
                                            onPress={() => onSelectRecentMessage(msg)}
                                            activeOpacity={0.7}
                                        >
                                            <Text
                                                style={styles.historyChipText}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {msg}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        {/* CADRE & ANIMATION BORDURE */}
                        <View style={styles.section}>
                            <Text style={styles.label}>🖼️ Cadre LED</Text>

                            {renderToggleButton(
                                showBorder ? 'Bordure affichée' : 'Bordure masquée',
                                'square',
                                showBorder,
                                onToggleBorder,
                                'border-button'
                            )}

                            {showBorder && (
                                <>
                                    {renderToggleButton(
                                        isBorderChase ? 'Style : Chenillard' : 'Style : Fixe',
                                        'infinite',
                                        isBorderChase,
                                        onToggleBorderChase,
                                        'chase-border-button'
                                    )}

                                    {renderToggleButton(
                                        isBorderBlinking ? 'Effet : Clignotant' : 'Effet : Constant',
                                        'flash',
                                        isBorderBlinking,
                                        onToggleBorderBlinking,
                                        'blink-border-button'
                                    )}
                                </>
                            )}
                        </View>

                        {/* EFFETS TEXTE */}
                        <View style={styles.section}>
                            <Text style={styles.label}>✨ Effets Texte</Text>
                            {renderToggleButton(
                                isTextBlinking ? 'Texte : Clignotant' : 'Texte : Fixe',
                                'flash',
                                isTextBlinking,
                                onToggleTextBlinking,
                                'blink-text-button'
                            )}
                        </View>

                        {/* VITESSE */}
                        <View style={styles.section}>
                            <Text style={styles.label}>⚡ Vitesse</Text>
                            <View style={styles.sliderContainer}>
                                <Slider
                                    testID="speed-slider"
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

                        {/* ORIENTATION */}
                        <View style={styles.section}>
                            <Text style={styles.label}>🔄 Orientation</Text>
                            {renderToggleButton(
                                isLandscapeLocked ? 'Mode Paysage Forcé' : 'Rotation Automatique',
                                'lock-closed',
                                isLandscapeLocked,
                                onToggleOrientation,
                                'orientation-button'
                            )}
                        </View>

                        {/* COULEUR */}
                        <View style={styles.section}>
                            <Text style={styles.label}>🎨 Couleur</Text>
                            <ColorSelector
                                selectedColor={selectedColor}
                                onColorChange={onColorChange}
                            />
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default SettingsModal;
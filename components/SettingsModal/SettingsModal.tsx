import React from 'react';
import {Modal, ScrollView, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {styles} from './styles';
import {COLORS} from '../constants';
import {SettingsProvider} from '../../context/SettingsContext';

import ColorSection from './components/ColorSection';
import {MessageSection} from "./components/MessageSection";
import {SpeedSection} from "./components/SpeedSection";
import {BorderSection} from "./components/BorderSection";
import {DisplayTextSection} from "./components/DisplayTextSection";
import {OrientationSection} from "./components/OrientationSection";
import {SettingsModalProps} from './types';
import {useTranslation} from '../../context/I18nContext';

const SettingsModal: React.FC<SettingsModalProps> = (props) => {
    const {visible, onClose, ...settingsValues} = props;
    const {height: screenHeight} = useWindowDimensions();

    const currentHsl = `hsl(${settingsValues.selectedColor.hue}, ${settingsValues.selectedColor.saturation}%, ${settingsValues.selectedColor.lightness}%)`;
    const {t} = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={onClose}/>

                <View style={[styles.modalContent, {maxHeight: screenHeight * 0.85}]}>
                    <View style={styles.headerModal}>
                        <Text style={styles.modalTitle}>{t.settingsTitle}</Text>

                        <TouchableOpacity testID="close-modal-button" style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.text}/>
                        </TouchableOpacity>
                    </View>

                    <SettingsProvider value={{...settingsValues, currentHsl}}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}
                                    keyboardShouldPersistTaps="handled">
                            <MessageSection/>
                            <BorderSection/>
                            <DisplayTextSection/>
                            <SpeedSection/>
                            <OrientationSection/>
                            <ColorSection/>
                        </ScrollView>
                    </SettingsProvider>

                </View>
            </View>
        </Modal>
    );
};

export default SettingsModal;
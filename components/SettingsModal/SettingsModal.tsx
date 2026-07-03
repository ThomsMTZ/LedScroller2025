import React from 'react';
import {Modal, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native';
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
import {TextAppearanceSection} from "./components/TextAppearanceSection";
import {AccordionSection} from "./components/AccordionSection";
import {SettingsModalProps} from './types';
import {useTranslation} from '../../context/I18nContext';

const SettingsModal: React.FC<SettingsModalProps> = (props) => {
    const {visible, onClose, ...settingsValues} = props;
    const {height: screenHeight} = useWindowDimensions();

    const currentHsl = `hsl(${settingsValues.selectedColor.hue}, ${settingsValues.selectedColor.saturation}%, ${settingsValues.selectedColor.lightness}%)`;
    const currentBorderHsl = `hsl(${settingsValues.borderColor.hue}, ${settingsValues.borderColor.saturation}%, ${settingsValues.borderColor.lightness}%)`;
    const {t} = useTranslation();

    return (
        <Modal 
            visible={visible} 
            transparent 
            animationType="slide" 
            onRequestClose={onClose}
            supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={onClose}/>

                <View style={[styles.modalContent, {maxHeight: screenHeight * 0.85}]}>
                    <View style={styles.headerModal}>
                        <Text style={styles.modalTitle}>{t.settingsTitle}</Text>

                        <TouchableOpacity testID="close-modal-button" style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.text}/>
                        </TouchableOpacity>
                    </View>

                    <SettingsProvider value={{...settingsValues, currentHsl, currentBorderHsl}}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}
                                    keyboardShouldPersistTaps="handled">
                            <AccordionSection title={t.messageLabel} defaultOpen={true}>
                                <MessageSection/>
                            </AccordionSection>
                            <AccordionSection title={t.colorLabel}>
                                <ColorSection/>
                            </AccordionSection>
                            <AccordionSection title={t.borderLabel}>
                                <BorderSection/>
                            </AccordionSection>
                            <AccordionSection title="✨ Taille & Épaisseur">
                                <TextAppearanceSection/>
                            </AccordionSection>
                            <AccordionSection title={t.textEffectsLabel}>
                                <DisplayTextSection/>
                            </AccordionSection>
                            <AccordionSection title={t.speedLabel}>
                                <SpeedSection/>
                            </AccordionSection>
                            <AccordionSection title={t.orientationLabel}>
                                <OrientationSection/>
                            </AccordionSection>
                        </ScrollView>
                    </SettingsProvider>

                </View>
            </View>
        </Modal>
    );
};

export default SettingsModal;
import React from 'react';
import {Modal, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {styles} from './styles';
import {COLORS} from '../constants';
import {useSettings} from '../../context/SettingsContext';

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
    const {isSettingsOpen, onCloseSettings} = useSettings();
    const {height: screenHeight} = useWindowDimensions();
    const {t} = useTranslation();

    return (
        <Modal 
            visible={isSettingsOpen} 
            transparent 
            animationType="slide" 
            onRequestClose={onCloseSettings}
            supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={onCloseSettings}/>

                <View style={[styles.modalContent, {maxHeight: screenHeight * 0.85}]}>
                    <View style={styles.headerModal}>
                        <Text style={styles.modalTitle}>{t.settingsTitle}</Text>

                        <TouchableOpacity testID="close-modal-button" style={styles.closeButton} onPress={onCloseSettings}>
                            <Ionicons name="close" size={24} color={COLORS.text}/>
                        </TouchableOpacity>
                    </View>

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
                                <TextAppearanceSection {...props} />
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

                </View>
            </View>
        </Modal>
    );
};

export default SettingsModal;
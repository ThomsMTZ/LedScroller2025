import React from 'react';
import {Modal, ScrollView, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {styles} from './styles';
import {SettingsModalProps} from './types';
import {
    ModalHeader,
    MessageSection,
    EffectsSection,
    SpeedSection,
    OrientationSection,
    BorderSection,
    ColorSection
} from './SettingsModal';

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
                                                         isTextBlinking,
                                                         onToggleTextBlinking,
                                                         isBorderBlinking,
                                                         onToggleBorderBlinking
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
            <View style={styles.modalOverlay}>

                <TouchableOpacity
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={onClose}
                    testID="modal-overlay"
                />

                <Animated.View
                    style={[
                        styles.modalContent,
                        {maxHeight: screenHeight * 0.85}
                    ]}
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(200)}
                >
                    <View style={styles.modalHandle}/>

                    <ModalHeader onClose={onClose}/>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 20}}
                        keyboardShouldPersistTaps="handled"
                    >

                        <MessageSection
                            text={text}
                            onTextChange={onTextChange}
                            currentHsl={currentHsl}
                        />

                        <EffectsSection
                            isTextBlinking={isTextBlinking}
                            onToggleTextBlinking={onToggleTextBlinking}
                            isBorderBlinking={isBorderBlinking}
                            onToggleBorderBlinking={onToggleBorderBlinking}
                            currentHsl={currentHsl}
                        />

                        <SpeedSection
                            speed={speed}
                            onSpeedChange={onSpeedChange}
                            currentHsl={currentHsl}
                        />

                        <OrientationSection
                            isLandscapeLocked={isLandscapeLocked}
                            onToggleOrientation={onToggleOrientation}
                            currentHsl={currentHsl}
                        />

                        <BorderSection
                            showBorder={showBorder}
                            onToggleBorder={onToggleBorder}
                            currentHsl={currentHsl}
                        />

                        <ColorSection
                            selectedColor={selectedColor}
                            onColorChange={onColorChange}
                        />

                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default SettingsModal;
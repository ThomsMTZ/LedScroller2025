import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {styles} from '../styles';
import {COLORS} from '../constants';

interface ModalHeaderProps {
    onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({onClose}) => {
    return (
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
    );
};

export default ModalHeader;

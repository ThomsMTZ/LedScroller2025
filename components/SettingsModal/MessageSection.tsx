import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {styles} from '../styles';
import {COLORS} from '../constants';

interface MessageSectionProps {
    text: string;
    onTextChange: (text: string) => void;
    currentHsl: string;
}

const MessageSection: React.FC<MessageSectionProps> = ({
    text,
    onTextChange,
    currentHsl
}) => {
    return (
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
    );
};

export default MessageSection;

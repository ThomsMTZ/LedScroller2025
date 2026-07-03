import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {styles} from '../styles';
import {COLORS} from '../../constants';
import {useSettings} from "../../../context/SettingsContext";
import {useTranslation} from "../../../context/I18nContext";

export const MessageSection: React.FC = () => {
    const {
        text,
        onTextChange,
        currentHsl,
        recentMessages,
        favoriteMessages,
        onSelectRecentMessage,
        onToggleFavorite
    } = useSettings();
    const currentTrimmedText = text.trim();
    const isCurrentTextFavorite = currentTrimmedText !== '' && favoriteMessages.includes(currentTrimmedText);
    const {t} = useTranslation();

    return (
        <View>
            <View style={[styles.input, {
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 10,
                borderColor: isCurrentTextFavorite ? currentHsl : '#333'
            }]}>
                <TextInput
                    style={{flex: 1, color: COLORS.text, paddingVertical: 0}}
                    value={text}
                    onChangeText={onTextChange}
                    placeholder={t.messagePlaceholder}
                    placeholderTextColor={COLORS.textMuted}
                    selectionColor={currentHsl}
                />
                {currentTrimmedText !== '' && (
                    <TouchableOpacity onPress={() => onToggleFavorite(currentTrimmedText)} hitSlop={15}>
                        <Ionicons
                            name={isCurrentTextFavorite ? "star" : "star-outline"}
                            size={22}
                            color={isCurrentTextFavorite ? currentHsl : COLORS.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Historique & Favoris (affichage en grille flexible) */}
            {(recentMessages.length > 0 || favoriteMessages.length > 0) && (
                <View testID="history-list" style={styles.historyContainer}>
                    {favoriteMessages.map((msg) => (
                        <TouchableOpacity key={`fav-${msg}`} style={[styles.historyChip, {borderColor: currentHsl}]}
                                          onPress={() => onSelectRecentMessage(msg)}
                                          onLongPress={() => onToggleFavorite(msg)} activeOpacity={0.7}>
                            <Text style={[styles.historyChipText, {color: currentHsl}]} numberOfLines={1}
                                  ellipsizeMode="tail">⭐ {msg}</Text>
                        </TouchableOpacity>
                    ))}
                    {recentMessages.map((msg) => (
                        <TouchableOpacity key={`rec-${msg}`} testID={`history-chip-${msg}`} style={styles.historyChip}
                                          onPress={() => onSelectRecentMessage(msg)}
                                          onLongPress={() => onToggleFavorite(msg)} activeOpacity={0.7}>
                            <Text style={styles.historyChipText} numberOfLines={1} ellipsizeMode="tail">{msg}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};
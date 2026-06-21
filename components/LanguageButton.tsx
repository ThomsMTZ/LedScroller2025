import React, {useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Modal, Pressable} from 'react-native';
import {COLORS} from './constants';
import {useTranslation} from '../context/I18nContext';
import {Locale} from '../i18n/types';

export const LanguageButton: React.FC = () => {
    const {locale, setLocale} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [buttonLayout, setButtonLayout] = useState<{x: number; y: number; width: number; height: number} | null>(null);
    const buttonRef = React.useRef<View>(null);

    const toggleOpen = () => {
        if (!isOpen && buttonRef.current) {
            buttonRef.current.measure((_fx, _fy, width, height, px, py) => {
                setButtonLayout({x: px, y: py, width, height});
                setIsOpen(true);
            });
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (lang: Locale) => {
        setLocale(lang);
        setIsOpen(false);
    };

    const getFlag = (l: Locale) => {
        switch (l) {
            case 'fr': return '🇫🇷';
            case 'en': return '🇬🇧';
            case 'es': return '🇪🇸';
        }
    };

    const otherLocales = (['fr', 'en', 'es'] as Locale[]).filter(l => l !== locale);

    return (
        <View>
            <View ref={buttonRef} collapsable={false}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={toggleOpen}
                    activeOpacity={0.7}
                >
                    <Text style={styles.flag}>{getFlag(locale)}</Text>
                </TouchableOpacity>
            </View>

            {isOpen && buttonLayout && (
                <Modal transparent animationType="none" visible={isOpen} onRequestClose={() => setIsOpen(false)}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)}>
                        <View
                            style={[
                                styles.dropdown,
                                {
                                    top: buttonLayout.y + buttonLayout.height + 8,
                                    left: buttonLayout.x,
                                },
                            ]}
                        >
                            {otherLocales.map((l, index) => (
                                <TouchableOpacity
                                    key={l}
                                    style={[
                                        styles.menuItem,
                                        index < otherLocales.length - 1 && styles.menuItemBorder,
                                    ]}
                                    onPress={() => handleSelect(l)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.flag}>{getFlag(l)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    flag: {
        fontSize: 22,
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
        width: 48,
    },
    menuItem: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
});

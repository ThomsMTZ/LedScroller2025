import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {LedColorType} from './types';
import {LED_COLORS} from './constants';

const STORAGE_KEY = '@led_scroller_settings_v1';

export interface SettingsState {
    text: string;
    speed: number;
    selectedColor: LedColorType;
    showBorder: boolean;
    isBorderChase: boolean;
    isBorderBlinking: boolean;
    isLandscapeLocked: boolean;
    isTextBlinking: boolean;
    isReverseScroll: boolean;
    recentMessages: string[];
    favoriteMessages: string[];
}

export const useLedSettings = (initialText: string = 'BONJOUR 2025') => {
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [settings, setSettings] = useState<SettingsState>({
        text: initialText,
        speed: 100,
        selectedColor: LED_COLORS[4],
        showBorder: true,
        isBorderChase: false,
        isBorderBlinking: false,
        isLandscapeLocked: false,
        isTextBlinking: false,
        isReverseScroll: false,
        recentMessages: [],
        favoriteMessages: [],
    });

    // --- Chargement au démarrage ---
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonValue != null) {
                    const saved = JSON.parse(jsonValue) as Partial<SettingsState>;
                    setSettings(prev => ({...prev, ...saved}));
                    if (saved.isLandscapeLocked) {
                        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                    }
                }
            } catch (e) {
                console.error('Erreur load settings', e);
            }
        };
        void loadSettings();
    }, []);

    // --- Sauvegarde avec debounce 1s ---
    useEffect(() => {
        const saveTimeout = setTimeout(async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            } catch (e) {
                console.error('Erreur save settings', e);
            }
        }, 1000);
        return () => clearTimeout(saveTimeout);
    }, [settings]);

    // --- Actions ---
    const toggleOrientation = useCallback(async () => {
        if (settings.isLandscapeLocked) {
            await ScreenOrientation.unlockAsync();
            setSettings(s => ({...s, isLandscapeLocked: false}));
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setSettings(s => ({...s, isLandscapeLocked: true}));
        }
    }, [settings.isLandscapeLocked]);

    const handleOpenSettings = useCallback(() => setSettingsOpen(true), []);

    const handleCloseSettings = useCallback(() => {
        setSettingsOpen(false);
        setSettings(s => {
            const trimmed = s.text.trim();
            if (trimmed && !s.favoriteMessages.includes(trimmed)) {
                const filteredRecents = s.recentMessages.filter(msg => msg !== trimmed);
                return {...s, recentMessages: [trimmed, ...filteredRecents].slice(0, 5)};
            }
            return s;
        });
    }, []);

    const toggleFavorite = useCallback((msg: string) => {
        setSettings(s => {
            const isFavorite = s.favoriteMessages.includes(msg);
            if (isFavorite) {
                return {
                    ...s,
                    favoriteMessages: s.favoriteMessages.filter(f => f !== msg),
                    recentMessages: [msg, ...s.recentMessages.filter(r => r !== msg)].slice(0, 5),
                };
            } else {
                return {
                    ...s,
                    favoriteMessages: [msg, ...s.favoriteMessages],
                    recentMessages: s.recentMessages.filter(r => r !== msg),
                };
            }
        });
    }, []);

    const createToggle = (key: keyof SettingsState) => () => {
        setSettings(s => ({...s, [key]: !s[key]}));
    };

    return {
        ...settings,
        isSettingsOpen,

        // Setters
        onTextChange: (text: string) => setSettings(s => ({...s, text})),
        onSpeedChange: (speed: number) => setSettings(s => ({...s, speed})),
        onColorChange: (color: LedColorType) => setSettings(s => ({...s, selectedColor: color})),

        // Actions
        onToggleOrientation: toggleOrientation,
        onOpenSettings: handleOpenSettings,
        onCloseSettings: handleCloseSettings,
        onToggleBorder: createToggle('showBorder'),
        onToggleBorderChase: createToggle('isBorderChase'),
        onToggleBorderBlinking: createToggle('isBorderBlinking'),
        onToggleTextBlinking: createToggle('isTextBlinking'),
        onToggleReverseScroll: createToggle('isReverseScroll'),
        onToggleFavorite: toggleFavorite,
        onSelectRecentMessage: (text: string) => setSettings(s => ({...s, text})),
    };
};

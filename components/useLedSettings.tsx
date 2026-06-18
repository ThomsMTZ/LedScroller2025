import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LedColorType} from './types';
import {LED_COLORS, ANIMATION_DURATIONS} from './constants';
import {useMessageHistory} from './useMessageHistory';
import {useOrientation} from './useOrientation';

const STORAGE_KEY = '@led_scroller_settings_v1';

export interface SettingsState {
    text: string;
    speed: number;
    selectedColor: LedColorType;
    showBorder: boolean;
    isBorderChase: boolean;
    isBorderBlinking: boolean;
    isTextBlinking: boolean;
    isReverseScroll: boolean;
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
        isTextBlinking: false,
        isReverseScroll: false,
    });

    const {
        recentMessages,
        favoriteMessages,
        addToRecents,
        toggleFavorite,
        loadHistory,
    } = useMessageHistory();

    const {
        isLandscapeLocked,
        setIsLandscapeLocked,
        toggleOrientation,
        lockLandscape,
    } = useOrientation();

    // --- Chargement au démarrage ---
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonValue != null) {
                    const saved = JSON.parse(jsonValue) as Partial<SettingsState & {
                        isLandscapeLocked: boolean;
                        recentMessages: string[];
                        favoriteMessages: string[];
                    }>;
                    const {isLandscapeLocked: savedLocked, recentMessages: savedRecents, favoriteMessages: savedFavs, ...coreSettings} = saved;
                    setSettings(prev => ({...prev, ...coreSettings}));
                    loadHistory({recentMessages: savedRecents, favoriteMessages: savedFavs});
                    if (savedLocked) {
                        await lockLandscape();
                        setIsLandscapeLocked(true);
                    }
                }
            } catch (e) {
                console.error('Erreur load settings', e);
            }
        };
        void loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Sauvegarde avec debounce ---
    useEffect(() => {
        const saveTimeout = setTimeout(async () => {
            try {
                const toSave = {...settings, isLandscapeLocked, recentMessages, favoriteMessages};
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
            } catch (e) {
                console.error('Erreur save settings', e);
            }
        }, ANIMATION_DURATIONS.settingsSaveDebounce);
        return () => clearTimeout(saveTimeout);
    }, [settings, isLandscapeLocked, recentMessages, favoriteMessages]);

    // --- Actions ---
    const handleOpenSettings = useCallback(() => setSettingsOpen(true), []);

    const handleCloseSettings = useCallback(() => {
        setSettingsOpen(false);
        addToRecents(settings.text);
    }, [settings.text, addToRecents]);

    const createToggle = (key: keyof SettingsState) => () => {
        setSettings(s => ({...s, [key]: !s[key]}));
    };

    return {
        ...settings,
        isSettingsOpen,
        isLandscapeLocked,

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

        // Messages
        recentMessages,
        favoriteMessages,
        onToggleFavorite: toggleFavorite,
        onSelectRecentMessage: (text: string) => setSettings(s => ({...s, text})),
    };
};

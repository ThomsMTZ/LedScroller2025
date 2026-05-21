import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LedColorType} from './types';
import {LED_COLORS} from './constants';

const STORAGE_KEY = '@led_settings_2026';

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

const DEFAULT_SETTINGS: SettingsState = {
    text: 'BONNE ANNÉE 2026',
    speed: 100,
    selectedColor: LED_COLORS[0],
    showBorder: true,
    isBorderChase: true,
    isBorderBlinking: false,
    isLandscapeLocked: false,
    isTextBlinking: false,
    isReverseScroll: false,
    recentMessages: [],
    favoriteMessages: [],
};

export const useLedSettings = () => {
    const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setSettings({...DEFAULT_SETTINGS, ...JSON.parse(stored)});
                }
            } catch (error) {
                console.error('Erreur de chargement des paramètres:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        void loadSettings();
    }, []);

    const updateSetting = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings(prev => {
            const newSettings = {...prev, [key]: value};
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings)).catch(console.error);
            return newSettings;
        });
    }, []);

    const actions = {
        onTextChange: (text: string) => updateSetting('text', text),
        onSpeedChange: (speed: number) => updateSetting('speed', speed),
        onColorChange: (color: LedColorType) => updateSetting('selectedColor', color),

        onToggleBorder: () => updateSetting('showBorder', !settings.showBorder),
        onToggleBorderChase: () => updateSetting('isBorderChase', !settings.isBorderChase),
        onToggleBorderBlinking: () => updateSetting('isBorderBlinking', !settings.isBorderBlinking),

        onToggleOrientation: () => updateSetting('isLandscapeLocked', !settings.isLandscapeLocked),
        onToggleTextBlinking: () => updateSetting('isTextBlinking', !settings.isTextBlinking),
        onToggleReverseScroll: () => updateSetting('isReverseScroll', !settings.isReverseScroll),

        onSelectRecentMessage: (msg: string) => updateSetting('text', msg),
        onToggleFavorite: (msg: string) => {
            setSettings(prev => {
                let newFavorites;
                if (prev.favoriteMessages.includes(msg)) {
                    newFavorites = prev.favoriteMessages.filter(f => f !== msg);
                } else {
                    newFavorites = [msg, ...prev.favoriteMessages];
                }

                const newSettings = {...prev, favoriteMessages: newFavorites};
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings)).catch(console.error);

                return newSettings;
            });
        }
    };

    return {
        isLoaded,
        ...settings,
        ...actions
    };
};
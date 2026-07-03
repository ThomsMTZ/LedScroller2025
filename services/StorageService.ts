import AsyncStorage from '@react-native-async-storage/async-storage';
import {Locale} from '../i18n/types';
import {LedColorType} from '../components/types';

// --- Clés de stockage centralisées ---
const KEYS = {
    settings: '@led_scroller_settings_v1',
    locale: '@led_scroller_locale',
} as const;

// --- Schéma typé des settings persistés ---
export interface PersistedSettings {
    text: string;
    speed: number;
    selectedColor: LedColorType;
    showBorder: boolean;
    isBorderChase: boolean;
    isBorderBlinking: boolean;
    isTextBlinking: boolean;
    isReverseScroll: boolean;
    isLandscapeLocked: boolean;
    recentMessages: string[];
    favoriteMessages: string[];
}

// --- Fonctions de persistance ---

const getSettings = async (): Promise<Partial<PersistedSettings> | null> => {
    try {
        const raw = await AsyncStorage.getItem(KEYS.settings);
        if (raw == null) return null;
        return JSON.parse(raw) as Partial<PersistedSettings>;
    } catch (e) {
        console.error('[StorageService] Erreur lecture settings', e);
        return null;
    }
};

const saveSettings = async (data: PersistedSettings): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.settings, JSON.stringify(data));
    } catch (e) {
        console.error('[StorageService] Erreur écriture settings', e);
    }
};

const getLocale = async (): Promise<Locale | null> => {
    try {
        const raw = await AsyncStorage.getItem(KEYS.locale);
        if (raw === 'fr' || raw === 'en' || raw === 'es') return raw;
        return null;
    } catch (e) {
        console.error('[StorageService] Erreur lecture locale', e);
        return null;
    }
};

const saveLocale = async (locale: Locale): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.locale, locale);
    } catch (e) {
        console.error('[StorageService] Erreur écriture locale', e);
    }
};

export const StorageService = {
    getSettings,
    saveSettings,
    getLocale,
    saveLocale,
} as const;

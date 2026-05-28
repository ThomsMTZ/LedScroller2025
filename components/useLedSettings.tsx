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
    // --- États plats (même structure que l'original) ---
    const [text, setText] = useState<string>(initialText);
    const [speed, setSpeed] = useState<number>(100);
    const [selectedColor, setSelectedColor] = useState<LedColorType>(LED_COLORS[4]);
    const [showBorder, setShowBorder] = useState<boolean>(true);
    const [isBorderChase, setIsBorderChase] = useState<boolean>(false);
    const [isBorderBlinking, setIsBorderBlinking] = useState<boolean>(false);
    const [isLandscapeLocked, setIsLandscapeLocked] = useState<boolean>(false);
    const [isTextBlinking, setIsTextBlinking] = useState<boolean>(false);
    const [isReverseScroll, setIsReverseScroll] = useState<boolean>(false);
    const [recentMessages, setRecentMessages] = useState<string[]>([]);
    const [favoriteMessages, setFavoriteMessages] = useState<string[]>([]);
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);

    // --- Chargement au démarrage ---
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonValue != null) {
                    const saved = JSON.parse(jsonValue);
                    if (saved.text) setText(saved.text);
                    if (saved.speed) setSpeed(saved.speed);
                    if (saved.selectedColor) setSelectedColor(saved.selectedColor);
                    if (saved.isLandscapeLocked) {
                        setIsLandscapeLocked(true);
                        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                    }
                    if (saved.showBorder !== undefined) setShowBorder(saved.showBorder);
                    if (saved.isTextBlinking !== undefined) setIsTextBlinking(saved.isTextBlinking);
                    if (saved.isBorderBlinking !== undefined) setIsBorderBlinking(saved.isBorderBlinking);
                    if (saved.isBorderChase !== undefined) setIsBorderChase(saved.isBorderChase);
                    if (saved.recentMessages) setRecentMessages(saved.recentMessages);
                    if (saved.favoriteMessages) setFavoriteMessages(saved.favoriteMessages);
                    if (saved.isReverseScroll !== undefined) setIsReverseScroll(saved.isReverseScroll);
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
                const settingsToSave: SettingsState = {
                    text, speed, selectedColor, isLandscapeLocked, showBorder,
                    isTextBlinking, isBorderBlinking, isBorderChase,
                    recentMessages, favoriteMessages, isReverseScroll,
                };
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
            } catch (e) {
                console.error('Erreur save settings', e);
            }
        }, 1000);
        return () => clearTimeout(saveTimeout);
    }, [text, speed, selectedColor, isLandscapeLocked, showBorder,
        isTextBlinking, isBorderBlinking, isBorderChase, recentMessages, favoriteMessages, isReverseScroll]);

    // --- Actions ---
    const toggleOrientation = useCallback(async () => {
        if (isLandscapeLocked) {
            await ScreenOrientation.unlockAsync();
            setIsLandscapeLocked(false);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setIsLandscapeLocked(true);
        }
    }, [isLandscapeLocked]);

    const handleOpenSettings = useCallback(() => {
        setSettingsOpen(true);
    }, []);

    const handleCloseSettings = useCallback(() => {
        setSettingsOpen(false);
        const currentTrimmed = text.trim();
        if (currentTrimmed !== '' && !favoriteMessages.includes(currentTrimmed)) {
            setRecentMessages(prev => {
                const filtered = prev.filter(msg => msg !== currentTrimmed);
                return [currentTrimmed, ...filtered].slice(0, 5);
            });
        }
    }, [text, favoriteMessages]);

    const toggleFavorite = useCallback((msg: string) => {
        if (favoriteMessages.includes(msg)) {
            setFavoriteMessages(prev => prev.filter(f => f !== msg));
            setRecentMessages(prev => [msg, ...prev.filter(r => r !== msg)].slice(0, 5));
        } else {
            setFavoriteMessages(prev => [msg, ...prev]);
            setRecentMessages(prev => prev.filter(r => r !== msg));
        }
    }, [favoriteMessages]);

    return {
        // États
        text,
        speed,
        selectedColor,
        showBorder,
        isBorderChase,
        isBorderBlinking,
        isLandscapeLocked,
        isTextBlinking,
        isReverseScroll,
        recentMessages,
        favoriteMessages,
        isSettingsOpen,

        // Setters directs
        setText,
        setSpeed,
        setSelectedColor,

        // Actions
        onToggleOrientation: toggleOrientation,
        onOpenSettings: handleOpenSettings,
        onCloseSettings: handleCloseSettings,
        onToggleBorder: () => setShowBorder(prev => !prev),
        onToggleBorderChase: () => setIsBorderChase(prev => !prev),
        onToggleBorderBlinking: () => setIsBorderBlinking(prev => !prev),
        onToggleTextBlinking: () => setIsTextBlinking(prev => !prev),
        onToggleReverseScroll: () => setIsReverseScroll(prev => !prev),
        onToggleFavorite: toggleFavorite,
        onSelectRecentMessage: setText,
    };
};

import {useCallback, useEffect, useState} from 'react';
import {LedColorType, SettingsState} from './types';
import {LED_COLORS, ANIMATION_DURATIONS} from './constants';
import {useMessageHistory} from './useMessageHistory';
import {useOrientation} from './useOrientation';
import {useSettingsPersistence} from './useSettingsPersistence';

const DEFAULT_SETTINGS: SettingsState = {
    text: 'BONJOUR 2025',
    speed: 100,
    selectedColor: LED_COLORS[4],
    showBorder: true,
    isBorderChase: false,
    isBorderBlinking: false,
    isTextBlinking: false,
    isReverseScroll: false,
};

export const useLedSettings = (initialText: string = 'BONJOUR 2025') => {
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [settings, setSettings] = useState<SettingsState>({
        ...DEFAULT_SETTINGS,
        text: initialText,
    });

    const {recentMessages, favoriteMessages, addToRecents, toggleFavorite, loadHistory} = useMessageHistory();
    const {isLandscapeLocked, setIsLandscapeLocked, toggleOrientation, lockLandscape} = useOrientation();
    const persistence = useSettingsPersistence();

    // --- Chargement au démarrage ---
    useEffect(() => {
        const loadSettings = async () => {
            const result = await persistence.load();
            if (result == null) return;

            setSettings(prev => ({...prev, ...result.coreSettings}));
            loadHistory(result.history);

            if (result.isLandscapeLocked) {
                await lockLandscape();
                setIsLandscapeLocked(true);
            }
        };
        void loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Sauvegarde avec debounce ---
    useEffect(() => {
        const saveTimeout = setTimeout(() => {
            persistence.save({
                settings,
                isLandscapeLocked,
                history: {recentMessages, favoriteMessages},
            });
        }, ANIMATION_DURATIONS.settingsSaveDebounce);

        return () => clearTimeout(saveTimeout);
    }, [settings, isLandscapeLocked, recentMessages, favoriteMessages, persistence]);

    // --- Actions ---
    const handleOpenSettings = useCallback(() => setSettingsOpen(true), []);

    const handleCloseSettings = useCallback(() => {
        setSettingsOpen(false);
        addToRecents(settings.text);
    }, [settings.text, addToRecents]);

    // Mémorisée avec useCallback pour éviter la re-création à chaque render
    const createToggle = useCallback((key: keyof SettingsState) => () => {
        setSettings(s => ({...s, [key]: !s[key]}));
    }, []);

    return {
        ...settings,
        isSettingsOpen,
        isLandscapeLocked,

        // Setters
        onTextChange: useCallback((text: string) => setSettings(s => ({...s, text})), []),
        onSpeedChange: useCallback((speed: number) => setSettings(s => ({...s, speed})), []),
        onColorChange: useCallback((color: LedColorType) => setSettings(s => ({...s, selectedColor: color})), []),

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
        onSelectRecentMessage: useCallback((text: string) => setSettings(s => ({...s, text})), []),
    };
};

import {useCallback, useEffect, useRef, useState} from 'react';
import {LedColorType, SettingsState} from '../types';
import {LED_COLORS, ANIMATION_DURATIONS} from '../constants';
import {useMessageHistory} from './useMessageHistory';
import {useOrientation} from './useOrientation';
import {useSettingsPersistence} from './useSettingsPersistence';
import {AnalyticsService} from '../../services/AnalyticsService';

const DEFAULT_SETTINGS: SettingsState = {
    text: 'Hello World',
    speed: 100,
    selectedColor: LED_COLORS[4],
    borderColor: LED_COLORS[4],
    showBorder: true,
    isBorderChase: false,
    isBorderBlinking: false,
    isTextBlinking: false,
    isReverseScroll: false,
    thickness: 900,
};

export const useLedSettings = (initialText: string = 'Hello World') => {
    const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [settings, setSettings] = useState<SettingsState>({
        ...DEFAULT_SETTINGS,
        text: initialText,
    });

    const {recentMessages, favoriteMessages, addToRecents, toggleFavorite, loadHistory} = useMessageHistory();
    const {isLandscapeLocked, setIsLandscapeLocked, toggleOrientation, lockLandscape} = useOrientation();
    const persistence = useSettingsPersistence();

    // Ref pour tracker si le texte vient d'un message récent sélectionné
    const isFromRecentRef = useRef<boolean>(false);

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
    const handleOpenSettings = useCallback(() => {
        setSettingsOpen(true);
        void AnalyticsService.logSettingsOpened('button');
    }, []);

    const handleCloseSettings = useCallback(() => {
        setSettingsOpen(false);
        addToRecents(settings.text);
        void AnalyticsService.logSettingsClosed(settings.text.length);
        void AnalyticsService.logMessageChanged(settings.text.length, isFromRecentRef.current);
        isFromRecentRef.current = false;
    }, [settings.text, addToRecents]);

    // Mémorisée avec useCallback pour éviter la re-création à chaque render
    const createToggle = useCallback((key: keyof SettingsState, effectName: Parameters<typeof AnalyticsService.logEffectToggled>[0]) =>
        () => {
            setSettings(s => {
                const newValue = !s[key];
                void AnalyticsService.logEffectToggled(effectName, newValue as boolean);
                return {...s, [key]: newValue};
            });
        },
    []);

    return {
        ...settings,
        isSettingsOpen,
        isLandscapeLocked,

        // Setters
        onTextChange: useCallback((text: string) => setSettings(s => ({...s, text})), []),

        onSpeedChange: useCallback((speed: number) => {
            setSettings(s => ({...s, speed}));
            void AnalyticsService.logSpeedChanged(speed);
        }, []),

        onThicknessChange: useCallback((thickness: number) => {
            setSettings(s => ({...s, thickness}));
        }, []),

        onColorChange: useCallback((color: LedColorType) => {
            setSettings(s => ({...s, selectedColor: color}));
            void AnalyticsService.logColorChanged(color.name);
        }, []),

        onBorderColorChange: useCallback((color: LedColorType) => {
            setSettings(s => ({...s, borderColor: color}));
        }, []),

        // Actions
        onToggleOrientation: useCallback(() => {
            toggleOrientation();
            void AnalyticsService.logOrientationToggled(!isLandscapeLocked);
        }, [toggleOrientation, isLandscapeLocked]),

        onOpenSettings: handleOpenSettings,
        onCloseSettings: handleCloseSettings,

        onToggleBorder: createToggle('showBorder', 'border'),
        onToggleBorderChase: createToggle('isBorderChase', 'border_chase'),
        onToggleBorderBlinking: createToggle('isBorderBlinking', 'border_blinking'),
        onToggleTextBlinking: createToggle('isTextBlinking', 'text_blinking'),
        onToggleReverseScroll: createToggle('isReverseScroll', 'reverse_scroll'),

        // Messages
        recentMessages,
        favoriteMessages,

        onToggleFavorite: useCallback((msg: string) => {
            const isFavorite = favoriteMessages.includes(msg);
            toggleFavorite(msg);
            void AnalyticsService.logFavoriteToggled(isFavorite ? 'remove' : 'add');
        }, [favoriteMessages, toggleFavorite]),

        onSelectRecentMessage: useCallback((text: string) => {
            isFromRecentRef.current = true;
            setSettings(s => ({...s, text}));
            void AnalyticsService.logRecentMessageSelected(text.length);
        }, []),
    };
};

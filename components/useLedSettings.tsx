import {useCallback, useEffect, useRef, useState} from 'react';
import {LedColorType, SettingsState} from './types';
import {LED_COLORS, ANIMATION_DURATIONS} from './constants';
import {useMessageHistory} from './useMessageHistory';
import {useOrientation} from './useOrientation';
import {useSettingsPersistence} from './useSettingsPersistence';
import {useAnalytics} from '../utils/useAnalytics';

const DEFAULT_SETTINGS: SettingsState = {
    text: 'Hello World',
    speed: 100,
    selectedColor: LED_COLORS[4],
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
    const analytics = useAnalytics();

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
        void analytics.logSettingsOpened('button');
    }, [analytics]);

    const handleCloseSettings = useCallback(() => {
        setSettingsOpen(false);
        addToRecents(settings.text);
        void analytics.logSettingsClosed(settings.text.length);
        void analytics.logMessageChanged(settings.text.length, isFromRecentRef.current);
        isFromRecentRef.current = false;
    }, [settings.text, addToRecents, analytics]);

    // Mémorisée avec useCallback pour éviter la re-création à chaque render
    const createToggle = useCallback((key: keyof SettingsState, effectName: Parameters<typeof analytics.logEffectToggled>[0]) =>
        () => {
            setSettings(s => {
                const newValue = !s[key];
                void analytics.logEffectToggled(effectName, newValue as boolean);
                return {...s, [key]: newValue};
            });
        },
    [analytics]);

    return {
        ...settings,
        isSettingsOpen,
        isLandscapeLocked,

        // Setters
        onTextChange: useCallback((text: string) => setSettings(s => ({...s, text})), []),

        onSpeedChange: useCallback((speed: number) => {
            setSettings(s => ({...s, speed}));
            void analytics.logSpeedChanged(speed);
        }, [analytics]),

        onThicknessChange: useCallback((thickness: number) => {
            setSettings(s => ({...s, thickness}));
        }, []),

        onColorChange: useCallback((color: LedColorType) => {
            setSettings(s => ({...s, selectedColor: color}));
            void analytics.logColorChanged(color.name);
        }, [analytics]),

        // Actions
        onToggleOrientation: useCallback(() => {
            toggleOrientation();
            void analytics.logOrientationToggled(!isLandscapeLocked);
        }, [toggleOrientation, analytics, isLandscapeLocked]),

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
            void analytics.logFavoriteToggled(isFavorite ? 'remove' : 'add');
        }, [favoriteMessages, toggleFavorite, analytics]),

        onSelectRecentMessage: useCallback((text: string) => {
            isFromRecentRef.current = true;
            setSettings(s => ({...s, text}));
            void analytics.logRecentMessageSelected(text.length);
        }, [analytics]),
    };
};

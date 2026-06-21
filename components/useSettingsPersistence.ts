import {useCallback} from 'react';
import {PersistedSettings, StorageService} from '../utils/storageService';
import {SettingsState} from './types';
import {MessageHistoryState} from './useMessageHistory';

interface PersistencePayload {
    settings: SettingsState;
    isLandscapeLocked: boolean;
    history: MessageHistoryState;
}

interface LoadResult {
    coreSettings: Partial<SettingsState>;
    isLandscapeLocked: boolean;
    history: Partial<MessageHistoryState>;
}

/**
 * Responsabilité unique : charger et sauvegarder les settings dans AsyncStorage.
 * N'a aucune connaissance de l'état React ou des gestures.
 */
export const useSettingsPersistence = () => {
    const load = useCallback(async (): Promise<LoadResult | null> => {
        const saved = await StorageService.getSettings();
        if (saved == null) return null;

        const {
            isLandscapeLocked,
            recentMessages,
            favoriteMessages,
            ...coreSettings
        } = saved;

        return {
            coreSettings,
            isLandscapeLocked: isLandscapeLocked ?? false,
            history: {
                recentMessages: recentMessages ?? [],
                favoriteMessages: favoriteMessages ?? [],
            },
        };
    }, []);

    const save = useCallback(({settings, isLandscapeLocked, history}: PersistencePayload): void => {
        const data: PersistedSettings = {
            ...settings,
            isLandscapeLocked,
            recentMessages: history.recentMessages,
            favoriteMessages: history.favoriteMessages,
        };
        void StorageService.saveSettings(data);
    }, []);

    return {load, save};
};

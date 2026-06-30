import {NativeModules} from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EffectName =
    | 'border'
    | 'border_chase'
    | 'border_blinking'
    | 'text_blinking'
    | 'reverse_scroll';

type SettingsTrigger = 'button' | 'double_tap';

// ---------------------------------------------------------------------------
// Guard Firebase : le module natif RNFBAppModule n'existe pas dans Expo Go.
// On ne fait jamais d'import statique de Firebase pour éviter le crash au boot.
// ---------------------------------------------------------------------------

const isFirebaseAvailable = !!NativeModules.RNFBAppModule;

// ---------------------------------------------------------------------------
// Helper interne : log dev + envoi Firebase
// ---------------------------------------------------------------------------

async function logEvent(name: string, params?: Record<string, string | number | boolean>): Promise<void> {
    if (!isFirebaseAvailable) {
        console.log(`[Analytics] ${name}`, params ?? {});
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const analytics = require('@react-native-firebase/analytics').default;
    await analytics().logEvent(name, params);
}

// ---------------------------------------------------------------------------
// Hook public
// ---------------------------------------------------------------------------

export const useAnalytics = () => {

    /** Modal Paramètres ouvert */
    const logSettingsOpened = (trigger: SettingsTrigger): Promise<void> =>
        logEvent('settings_opened', { trigger });

    /** Modal Paramètres fermé */
    const logSettingsClosed = (textLength: number): Promise<void> =>
        logEvent('settings_closed', { text_length: textLength });

    /** Texte modifié et validé (à la fermeture du modal) */
    const logMessageChanged = (textLength: number, isFromRecent: boolean): Promise<void> =>
        logEvent('message_changed', { text_length: textLength, is_from_recent: isFromRecent });

    /** Couleur LED changée */
    const logColorChanged = (colorName: string): Promise<void> =>
        logEvent('color_changed', { color_name: colorName });

    /** Vitesse de défilement modifiée (appeler à la fin du sliding) */
    const logSpeedChanged = (speedValue: number): Promise<void> =>
        logEvent('speed_changed', { speed_value: speedValue });

    /** Verrouillage de l'orientation basculé */
    const logOrientationToggled = (locked: boolean): Promise<void> =>
        logEvent('orientation_toggled', { locked });

    /** Effet visuel (border, blink, etc.) activé/désactivé */
    const logEffectToggled = (effect: EffectName, enabled: boolean): Promise<void> =>
        logEvent('effect_toggled', { effect, enabled });

    /** Message ajouté ou retiré des favoris */
    const logFavoriteToggled = (action: 'add' | 'remove'): Promise<void> =>
        logEvent('favorite_toggled', { action });

    /** Message récent sélectionné depuis l'historique */
    const logRecentMessageSelected = (textLength: number): Promise<void> =>
        logEvent('recent_message_selected', { text_length: textLength });

    return {
        logSettingsOpened,
        logSettingsClosed,
        logMessageChanged,
        logColorChanged,
        logSpeedChanged,
        logOrientationToggled,
        logEffectToggled,
        logFavoriteToggled,
        logRecentMessageSelected,
    };
};

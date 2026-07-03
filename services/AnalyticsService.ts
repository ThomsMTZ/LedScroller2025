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
// Service public
// ---------------------------------------------------------------------------

export const AnalyticsService = {

    /** Modal Paramètres ouvert */
    logSettingsOpened: (trigger: SettingsTrigger): Promise<void> =>
        logEvent('settings_opened', { trigger }),

    /** Modal Paramètres fermé */
    logSettingsClosed: (textLength: number): Promise<void> =>
        logEvent('settings_closed', { text_length: textLength }),

    /** Texte modifié et validé (à la fermeture du modal) */
    logMessageChanged: (textLength: number, isFromRecent: boolean): Promise<void> =>
        logEvent('message_changed', { text_length: textLength, is_from_recent: isFromRecent }),

    /** Couleur LED changée */
    logColorChanged: (colorName: string): Promise<void> =>
        logEvent('color_changed', { color_name: colorName }),

    /** Vitesse de défilement modifiée (appeler à la fin du sliding) */
    logSpeedChanged: (speedValue: number): Promise<void> =>
        logEvent('speed_changed', { speed_value: speedValue }),

    /** Verrouillage de l'orientation basculé */
    logOrientationToggled: (locked: boolean): Promise<void> =>
        logEvent('orientation_toggled', { locked }),

    /** Effet visuel (border, blink, etc.) activé/désactivé */
    logEffectToggled: (effect: EffectName, enabled: boolean): Promise<void> =>
        logEvent('effect_toggled', { effect, enabled }),

    /** Message ajouté ou retiré des favoris */
    logFavoriteToggled: (action: 'add' | 'remove'): Promise<void> =>
        logEvent('favorite_toggled', { action }),

    /** Message récent sélectionné depuis l'historique */
    logRecentMessageSelected: (textLength: number): Promise<void> =>
        logEvent('recent_message_selected', { text_length: textLength }),
};

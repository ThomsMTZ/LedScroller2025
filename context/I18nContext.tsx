import React, {createContext, useContext, useEffect, useState, useMemo, useCallback} from 'react';
import * as Localization from 'expo-localization';
import {Locale, Translations} from '../i18n/types';
import {fr} from '../i18n/translations/fr';
import {en} from '../i18n/translations/en';
import {es} from '../i18n/translations/es';
import {StorageService} from '../services/StorageService';

const TRANSLATIONS: Record<Locale, Translations> = { fr, en, es };

interface I18nContextProps {
    locale: Locale;
    setLocale: (locale: Locale) => Promise<void>;
    t: Translations;
}

const I18nContext = createContext<I18nContextProps>({
    locale: 'fr',
    setLocale: () => Promise.resolve(),
    t: fr,
});

const getDeviceLocale = (): Locale => {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
        const langCode = locales[0].languageCode;
        if (langCode === 'en') return 'en';
        if (langCode === 'es') return 'es';
    }
    return 'fr'; // Français par défaut
};

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [currentLocale, setCurrentLocale] = useState<Locale>('fr');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadLocale = async () => {
            try {
                const storedLocale = await StorageService.getLocale();
                setCurrentLocale(storedLocale ?? getDeviceLocale());
            } catch (error) {
                console.error('Failed to load locale', error);
                setCurrentLocale(getDeviceLocale());
            } finally {
                setIsLoaded(true);
            }
        };
        void loadLocale();
    }, []);

    const setLocale = useCallback(async (newLocale: Locale): Promise<void> => {
        setCurrentLocale(newLocale);
        await StorageService.saveLocale(newLocale);
    }, []);

    const contextValue = useMemo(() => ({
        locale: currentLocale,
        setLocale,
        t: TRANSLATIONS[currentLocale]
    }), [currentLocale, setLocale]);

    if (!isLoaded) return null;

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
};

export const useTranslation = () => useContext(I18nContext);

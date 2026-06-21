import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {Locale, Translations} from '../i18n/types';
import {fr} from '../i18n/translations/fr';
import {en} from '../i18n/translations/en';
import {es} from '../i18n/translations/es';

const TRANSLATIONS: Record<Locale, Translations> = { fr, en, es };
const STORAGE_KEY = '@led_scroller_locale';

interface I18nContextProps {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
}

const I18nContext = createContext<I18nContextProps>({
    locale: 'fr',
    setLocale: () => {},
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
    const [locale, setLocaleState] = useState<Locale>('fr');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadLocale = async () => {
            try {
                const storedLocale = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedLocale && (storedLocale === 'fr' || storedLocale === 'en' || storedLocale === 'es')) {
                    setLocaleState(storedLocale as Locale);
                } else {
                    setLocaleState(getDeviceLocale());
                }
            } catch (error) {
                console.error("Failed to load locale", error);
                setLocaleState(getDeviceLocale());
            } finally {
                setIsLoaded(true);
            }
        };
        void loadLocale();
    }, []);

    const setLocale = async (newLocale: Locale) => {
        setLocaleState(newLocale);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, newLocale);
        } catch (error) {
            console.error("Failed to save locale", error);
        }
    };

    if (!isLoaded) return null;

    return (
        <I18nContext.Provider value={{locale, setLocale, t: TRANSLATIONS[locale]}}>
            {children}
        </I18nContext.Provider>
    );
};

export const useTranslation = () => useContext(I18nContext);

import React, {createContext, useContext, useMemo} from 'react';
import {useLedSettings} from '../hooks/useLedSettings';

export type SettingsContextType = ReturnType<typeof useLedSettings> & {
    currentHsl: string;
    currentBorderHsl: string;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ value?: Partial<SettingsContextType>, children: React.ReactNode }> = ({ value, children }) => {
    const settings = useLedSettings();
    const currentHsl = `hsl(${settings.selectedColor.hue}, ${settings.selectedColor.saturation}%, ${settings.selectedColor.lightness}%)`;
    const currentBorderHsl = `hsl(${settings.borderColor.hue}, ${settings.borderColor.saturation}%, ${settings.borderColor.lightness}%)`;

    const contextValue = useMemo(() => {
        return value ? { ...settings, currentHsl, currentBorderHsl, ...value } : { ...settings, currentHsl, currentBorderHsl };
    }, [settings, currentHsl, currentBorderHsl, value]);

    return (
        <SettingsContext.Provider value={contextValue as SettingsContextType}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings have to be used within a SettingsProvider");
    }
    return context;
};
import React, {createContext, useContext} from 'react';
import {SettingsModalProps} from '../components/SettingsModal/types';

export interface SettingsContextType extends Omit<SettingsModalProps, 'visible' | 'onClose'> {
    currentHsl: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ value: SettingsContextType, children: React.ReactNode }> = ({
                                                                                                          value,
                                                                                                          children
                                                                                                      }) => {
    return (
        <SettingsContext.Provider value={value}>
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
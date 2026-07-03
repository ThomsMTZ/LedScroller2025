import React from 'react';
import {render, act, screen, fireEvent} from '@testing-library/react-native';
import {I18nProvider, useTranslation} from '../../context/I18nContext';
import {Text, Button, View} from 'react-native';
import {StorageService} from '../../services/StorageService';

jest.mock('../../services/StorageService', () => ({
    StorageService: {
        getLocale: jest.fn(),
        saveLocale: jest.fn(),
    }
}));

jest.mock('expo-localization', () => ({
    __esModule: true,
    getLocales: jest.fn(() => [{ languageCode: 'en' }]),
}));

const TestComponent = () => {
    const {t, locale, setLocale} = useTranslation();

    return (
        <>
            <Text testID="locale-text">{locale}</Text>
            <Text testID="translated-text">{t.settingsTitle}</Text>
            <Button testID="set-en" title="Set EN" onPress={() => setLocale('en')} />
            <Button testID="set-fr" title="Set FR" onPress={() => setLocale('fr')} />
        </>
    );
};

describe('I18nContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait initialiser avec la langue système (en) par défaut si StorageService renvoie null', async () => {
        (StorageService.getLocale as jest.Mock).mockResolvedValueOnce(null);

        render(
            <View>
                <I18nProvider>
                    <TestComponent />
                </I18nProvider>
            </View>
        );

        // Attendre que isLoaded passe à true (la vue est rendue)
        await screen.findByTestId('locale-text');

        // La locale par défaut sans AsyncStorage ni configuration locale Expo spécifique, devrait être 'en'
        expect(screen.getByTestId('locale-text').props.children).toBe('en');
        // '⚙️ Config' est la trad de 'settingsTitle'
        expect(screen.getByTestId('translated-text').props.children).toBe('⚙️ Config');
    });

    it('devrait initialiser avec la langue de StorageService si présente', async () => {
        (StorageService.getLocale as jest.Mock).mockResolvedValueOnce('fr');

        render(
            <View>
                <I18nProvider>
                    <TestComponent />
                </I18nProvider>
            </View>
        );

        await screen.findByTestId('locale-text');

        expect(screen.getByTestId('locale-text').props.children).toBe('fr');
        expect(screen.getByTestId('translated-text').props.children).toBe('⚙️ Config');
    });

    it('devrait permettre de changer la langue et sauvegarder dans StorageService', async () => {
        (StorageService.getLocale as jest.Mock).mockResolvedValueOnce('en');

        render(
            <View>
                <I18nProvider>
                    <TestComponent />
                </I18nProvider>
            </View>
        );

        await screen.findByTestId('locale-text');

        // Click to change to French
        act(() => {
            fireEvent.press(screen.getByTestId('set-fr'));
        });

        expect(screen.getByTestId('locale-text').props.children).toBe('fr');
        expect(StorageService.saveLocale).toHaveBeenCalledWith('fr');
        expect(screen.getByTestId('translated-text').props.children).toBe('⚙️ Config');
    });

});

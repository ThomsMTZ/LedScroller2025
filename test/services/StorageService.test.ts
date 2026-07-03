import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageService, PersistedSettings} from '../../services/StorageService';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('StorageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('devrait récupérer les settings avec succès', async () => {
        const mockSettings: Partial<PersistedSettings> = {text: 'Test'};
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockSettings));
        const result = await StorageService.getSettings();
        expect(result).toEqual(mockSettings);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@led_scroller_settings_v1');
    });

    it('devrait renvoyer null si les settings sont vides', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const result = await StorageService.getSettings();
        expect(result).toBeNull();
    });

    it('devrait catcher l erreur et renvoyer null lors de la récupération des settings', async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('AsyncStorage Error'));
        const result = await StorageService.getSettings();
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalled();
    });

    it('devrait sauvegarder les settings avec succès', async () => {
        const mockSettings = {text: 'Test'} as PersistedSettings;
        await StorageService.saveSettings(mockSettings);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('@led_scroller_settings_v1', JSON.stringify(mockSettings));
    });

    it('devrait catcher l erreur lors de la sauvegarde des settings', async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('AsyncStorage Error'));
        const mockSettings = {text: 'Test'} as PersistedSettings;
        await StorageService.saveSettings(mockSettings);
        expect(console.error).toHaveBeenCalled();
    });

    it('devrait récupérer la locale avec succès si valide', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('fr');
        const result = await StorageService.getLocale();
        expect(result).toBe('fr');
    });

    it('devrait renvoyer null si la locale est invalide ou vide', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('it'); // invalide
        let result = await StorageService.getLocale();
        expect(result).toBeNull();

        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null); // vide
        result = await StorageService.getLocale();
        expect(result).toBeNull();
    });

    it('devrait catcher l erreur et renvoyer null lors de la récupération de la locale', async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('AsyncStorage Error'));
        const result = await StorageService.getLocale();
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalled();
    });

    it('devrait sauvegarder la locale avec succès', async () => {
        await StorageService.saveLocale('es');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('@led_scroller_locale', 'es');
    });

    it('devrait catcher l erreur lors de la sauvegarde de la locale', async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('AsyncStorage Error'));
        await StorageService.saveLocale('es');
        expect(console.error).toHaveBeenCalled();
    });
});

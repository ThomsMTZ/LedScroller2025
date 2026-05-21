import {act, renderHook} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLedSettings} from "../../components/useLedSettings";
import {LED_COLORS} from "../../components";

// 💡 CORRECTION : Mock officiel d'AsyncStorage pour Jest
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const STORAGE_KEY = '@led_settings_2026';

describe('useLedSettings Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait initialiser avec les valeurs par défaut si le stockage est vide', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const {result} = renderHook(() => useLedSettings());

        await act(async () => {
        });

        expect(result.current.isLoaded).toBe(true);
        expect(result.current.text).toBe('BONNE ANNÉE 2026');
        expect(result.current.speed).toBe(100);
        expect(result.current.selectedColor).toEqual(LED_COLORS[0]);
    });

    it('devrait charger les paramètres sauvegardés depuis AsyncStorage', async () => {
        const mockSavedSettings = {
            text: 'Test Unitaire',
            speed: 350,
            selectedColor: LED_COLORS[3],
            showBorder: false,
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockSavedSettings));

        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        expect(result.current.text).toBe('Test Unitaire');
        expect(result.current.speed).toBe(350);
        expect(result.current.showBorder).toBe(false);
        expect(result.current.selectedColor).toEqual(LED_COLORS[3]);
    });

    it('devrait mettre à jour un paramètre simple et déclencher AsyncStorage', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        act(() => {
            result.current.onTextChange('Nouveau Message');
        });

        expect(result.current.text).toBe('Nouveau Message');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            expect.stringContaining('"text":"Nouveau Message"')
        );
    });

    it('devrait gérer l’ajout et la suppression des favoris correctement', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        act(() => {
            result.current.onToggleFavorite('Fraise');
        });

        expect(result.current.favoriteMessages).toEqual(['Fraise']);

        act(() => {
            result.current.onToggleFavorite('Fraise');
        });
        expect(result.current.favoriteMessages).toEqual([]);
    });
});
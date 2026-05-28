import {act, renderHook} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLedSettings} from "../../components/useLedSettings";
import {LED_COLORS} from "../../components";

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('useLedSettings Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait initialiser avec les valeurs par défaut si le stockage est vide', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const {result} = renderHook(() => useLedSettings('BONJOUR 2025'));

        await act(async () => {
        });

        expect(result.current.text).toBe('BONJOUR 2025');
        expect(result.current.speed).toBe(100);
        expect(result.current.selectedColor).toEqual(LED_COLORS[4]); // Cyan par défaut
        expect(result.current.showBorder).toBe(true);
        expect(result.current.isSettingsOpen).toBe(false);
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

    it('devrait mettre à jour le texte via onTextChange', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        act(() => {
            result.current.onTextChange('Nouveau Message');
        });

        expect(result.current.text).toBe('Nouveau Message');
    });

    it('devrait gérer l\'ajout et la suppression des favoris correctement', async () => {
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

    it('devrait ouvrir et fermer les settings', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        expect(result.current.isSettingsOpen).toBe(false);

        act(() => {
            result.current.onOpenSettings();
        });
        expect(result.current.isSettingsOpen).toBe(true);

        act(() => {
            result.current.onCloseSettings();
        });
        expect(result.current.isSettingsOpen).toBe(false);
    });

    it('devrait basculer les options booléennes', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        act(() => {
            result.current.onToggleBorder();
        });
        expect(result.current.showBorder).toBe(false);

        act(() => {
            result.current.onToggleTextBlinking();
        });
        expect(result.current.isTextBlinking).toBe(true);

        act(() => {
            result.current.onToggleReverseScroll();
        });
        expect(result.current.isReverseScroll).toBe(true);
    });

    it('devrait ajouter le message courant aux recentMessages à la fermeture des settings', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        act(() => {
            result.current.onTextChange('Mon super message');
        });
        act(() => {
            result.current.onOpenSettings();
        });
        act(() => {
            result.current.onCloseSettings();
        });

        expect(result.current.recentMessages).toContain('Mon super message');
    });

    it('ne devrait pas ajouter aux recentMessages si le message est déjà un favori', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        act(() => {
            result.current.onTextChange('Favori existant');
        });
        act(() => {
            result.current.onToggleFavorite('Favori existant');
        });
        act(() => {
            result.current.onCloseSettings();
        });

        expect(result.current.recentMessages).not.toContain('Favori existant');
    });

    it('devrait sélectionner un message récent via onSelectRecentMessage', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        act(() => {
            result.current.onSelectRecentMessage('Message sélectionné');
        });

        expect(result.current.text).toBe('Message sélectionné');
    });

    it('devrait limiter recentMessages à 5 entrées', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const {result} = renderHook(() => useLedSettings());
        await act(async () => {
        });

        const messages = ['A', 'B', 'C', 'D', 'E', 'F'];
        for (const msg of messages) {
            act(() => {
                result.current.onTextChange(msg);
            });
            act(() => {
                result.current.onCloseSettings();
            });
        }

        expect(result.current.recentMessages.length).toBeLessThanOrEqual(5);
    });
});
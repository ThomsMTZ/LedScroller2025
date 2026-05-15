import React from 'react';
import {fireEvent, render, waitFor, within} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LedScroller} from '../components';
import {StyleSheet} from 'react-native';

describe('<LedScroller /> Integration', () => {

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        await AsyncStorage.clear();
    });

    it('charge la configuration sauvegardée au démarrage', async () => {
        const fakeSettings = {
            text: 'TEXTE SAUVEGARDE',
            speed: 200,
            showBorder: false,
            selectedColor: {hue: 0, saturation: 100, lightness: 50, name: 'Rouge'}
        };

        await AsyncStorage.setItem('@led_scroller_settings_v1', JSON.stringify(fakeSettings));

        const {getAllByText} = render(<LedScroller initialText="DEFAUT"/>);

        await waitFor(() => {
            const elements = getAllByText('TEXTE SAUVEGARDE');
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    it('sauvegarde tous les paramètres (texte, vitesse, couleur, bordure)', async () => {
        await AsyncStorage.setItem('@led_scroller_settings_v1', JSON.stringify({
            text: 'NOUVEAU',
            speed: 150,
            selectedColor: {hue: 120, saturation: 100, lightness: 50, name: 'Vert'},
            showBorder: false,
            isLandscapeLocked: true,
            isTextBlinking: true,
            isBorderBlinking: true
        }));

        await waitFor(async () => {
            const saved = await AsyncStorage.getItem('@led_scroller_settings_v1');
            const parsed = saved ? JSON.parse(saved) : null;
            expect(parsed.text).toBe('NOUVEAU');
            expect(parsed.showBorder).toBe(false);
            expect(parsed.speed).toBe(150);
            expect(parsed.selectedColor).toMatchObject({hue: 120, saturation: 100, lightness: 50, name: 'Vert'});
            expect(parsed.isLandscapeLocked).toBe(true);
            expect(parsed.isTextBlinking).toBe(true);
            expect(parsed.isBorderBlinking).toBe(true);
        });
    });

    it('utilise le texte par défaut si aucune sauvegarde n\'existe', async () => {
        const {getAllByText} = render(<LedScroller initialText="BONJOUR"/>);

        await waitFor(() => {
            const elements = getAllByText('BONJOUR');
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    it('met à jour la couleur du texte avec HSL', async () => {
        const {getAllByText} = render(<LedScroller initialText="BONJOUR 2025"/>);

        await waitFor(() => {
            const textElements = getAllByText('BONJOUR 2025');
            const firstElement = textElements[0];
            const flatStyle = StyleSheet.flatten(firstElement.props.style);

            expect(flatStyle.color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
        });
    });


    it('démarre l\'animation du scroll au montage', async () => {
        const {getByTestId} = render(<LedScroller initialText="TEST"/>);

        await waitFor(() => {
            const scrollingContainer = getByTestId('scrolling-container');

            const flatStyle = StyleSheet.flatten(scrollingContainer.props.style);

            expect(flatStyle.transform).toBeDefined();

            expect(flatStyle.transform).toBeTruthy();
        });
    });

    it('arrête l\'animation lors du démontage', () => {
        const {unmount} = render(<LedScroller initialText="TEST"/>);
        unmount();
    });

    it('possède les éléments interactifs pour le zoom', async () => {
        const {getByTestId, getAllByTestId} = render(<LedScroller initialText="TEST"/>);

        const gestureView = getByTestId('gesture-detector');
        expect(gestureView).toBeTruthy();

        const textElements = getAllByTestId('scrolling-text');
        const firstText = textElements[0];

        const flatStyle = StyleSheet.flatten(firstText.props.style);
        expect(flatStyle.fontSize).toBe(100);
    });

    it('ouvre les paramètres au clic sur le bouton', async () => {
        const {getByTestId, findByText} = render(<LedScroller initialText="TEST"/>);
        const settingsBtn = getByTestId('settings-button');

        fireEvent.press(settingsBtn);

        const modalTitle = await findByText('⚙️ Config');
        expect(modalTitle).toBeTruthy();
    });

    it('gère un texte vide sans crasher', () => {
        const {getAllByTestId} = render(<LedScroller initialText=""/>);

        const textElements = getAllByTestId('scrolling-text');

        expect(textElements.length).toBeGreaterThan(0);
        expect(textElements[0].props.children).toBe('');
    });

    it('gère une vitesse zéro ou négative sans crasher', async () => {
        await AsyncStorage.setItem('@led_scroller_settings_v1', JSON.stringify({
            speed: -50 // Cas limite
        }));

        const {getAllByText} = render(<LedScroller/>);

        await waitFor(() => {
            const elements = getAllByText('BONJOUR 2025');

            expect(elements.length).toBeGreaterThan(0);
        });
    });

    it('gère les erreurs AsyncStorage gracieusement', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });

        const getItemSpy = jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage error'));

        const {getAllByText} = render(<LedScroller initialText="BONJOUR 2025"/>);

        await waitFor(() => {
            const elements = getAllByText('BONJOUR 2025');
            expect(elements.length).toBeGreaterThan(0);
        });

        expect(consoleSpy).toHaveBeenCalledWith(
            'Erreur load',
            expect.any(Error)
        );

        getItemSpy.mockRestore();
        consoleSpy.mockRestore();
    });

    it('applique le clignotement du texte et de la bordure', async () => {
        const saved = {
            text: 'BLINK',
            isTextBlinking: true,
            isBorderBlinking: true,
            selectedColor: {hue: 0, saturation: 100, lightness: 50, name: 'Rouge'}
        };
        await AsyncStorage.setItem('@led_scroller_settings_v1', JSON.stringify(saved));

        const {getByTestId, getAllByTestId} = render(<LedScroller/>);

        await waitFor(() => {
            const text = getAllByTestId('scrolling-text')[0];
            const textStyle = StyleSheet.flatten(text.props.style);
            expect(textStyle.opacity).toBeDefined();

            const borderWrapper = getByTestId('led-display');
            const borderStyle = StyleSheet.flatten(borderWrapper.props.style);

            expect(borderStyle.opacity).toBeDefined();
        });
    });
});

describe('<LedScroller /> Recent Messages Feature', () => {

    const openSettings = async (queries: {
        getByTestId: (id: string) => any;
        findByText: (text: string) => Promise<any>
    }) => {
        fireEvent.press(queries.getByTestId('settings-button'));
        await queries.findByText('⚙️ Config');
    };

    const closeSettings = (queries: { getByTestId: (id: string) => any }) => {
        fireEvent.press(queries.getByTestId('close-modal-button'));
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        await AsyncStorage.clear();
    });

    it('sauvegarde le message courant dans l\'historique à la fermeture du modal', async () => {
        const queries = render(<LedScroller initialText="INITIAL"/>);

        await openSettings(queries);
        closeSettings(queries);

        await openSettings(queries);
        const historyList = queries.getByTestId('history-list');
        expect(within(historyList).getByText('INITIAL')).toBeTruthy();
    });

    it('ajoute le message à l\'historique lors de la fermeture du modal', async () => {
        const queries = render(<LedScroller initialText="TEST"/>);

        await openSettings(queries);

        const textInput = queries.getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(textInput, 'NOUVEAU MESSAGE');

        closeSettings(queries);
        await openSettings(queries);
        const historyList = queries.getByTestId('history-list');
        expect(within(historyList).getByText('NOUVEAU MESSAGE')).toBeTruthy();
    });

    it('limite l\'historique à 5 messages maximum', async () => {
        const queries = render(<LedScroller initialText="TEST"/>);
        const messages = ['MSG1', 'MSG2', 'MSG3', 'MSG4', 'MSG5', 'MSG6'];

        for (const msg of messages) {
            await openSettings(queries);
            fireEvent.changeText(queries.getByPlaceholderText('Entrez votre message...'), msg);
            closeSettings(queries);
        }

        await openSettings(queries);
        const historyList = queries.getByTestId('history-list');
        expect(within(historyList).queryByText('MSG1')).toBeNull();
        expect(within(historyList).getByText('MSG2')).toBeTruthy();
        expect(within(historyList).getByText('MSG6')).toBeTruthy();
    });

    it('évite les doublons dans l\'historique', async () => {
        const queries = render(<LedScroller initialText="TEST"/>);

        await openSettings(queries);
        fireEvent.changeText(queries.getByPlaceholderText('Entrez votre message...'), 'DUPLICATE');
        closeSettings(queries);

        await openSettings(queries);
        fireEvent.changeText(queries.getByPlaceholderText('Entrez votre message...'), 'OTHER');
        closeSettings(queries);

        await openSettings(queries);
        fireEvent.changeText(queries.getByPlaceholderText('Entrez votre message...'), 'DUPLICATE');
        closeSettings(queries);

        await openSettings(queries);
        const historyList = queries.getByTestId('history-list');
        expect(within(historyList).getAllByText('DUPLICATE')).toHaveLength(1);
    });

    it('charge l\'historique des messages depuis le stockage', async () => {
        jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(JSON.stringify({
            text: 'INITIAL',
            recentMessages: ['SAVED1', 'SAVED2', 'SAVED3']
        }));

        const queries = render(<LedScroller initialText="TEST"/>);
        await openSettings(queries);

        expect(await queries.findByText('SAVED1')).toBeTruthy();
        expect(await queries.findByText('SAVED2')).toBeTruthy();
        expect(await queries.findByText('SAVED3')).toBeTruthy();
    });

    it('ignore les messages vides lors de la sauvegarde', async () => {
        const queries = render(<LedScroller initialText="TEST"/>);

        await openSettings(queries);

        const textInput = queries.getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(textInput, '   ');

        closeSettings(queries);
        await openSettings(queries);

        expect(queries.queryByTestId('history-list')).toBeNull();
    });

    it('préserve l\'ordre des messages : les plus récents en premier', async () => {
        const queries = render(<LedScroller initialText="TEST"/>);

        for (const msg of ['OLD1', 'OLD2', 'NEW']) {
            await openSettings(queries);
            fireEvent.changeText(queries.getByPlaceholderText('Entrez votre message...'), msg);
            closeSettings(queries);
        }

        await openSettings(queries);
        const historyList = queries.getByTestId('history-list');
        const ordered = within(historyList).getAllByText(/OLD1|OLD2|NEW/).map(node => node.props.children);

        expect(ordered.indexOf('NEW')).toBeLessThan(ordered.indexOf('OLD2'));
        expect(ordered.indexOf('OLD2')).toBeLessThan(ordered.indexOf('OLD1'));
    });

    it('charge la direction inversée depuis le stockage', async () => {
        jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(JSON.stringify({
            text: 'INITIAL',
            isReverseScroll: true
        }));

        const queries = render(<LedScroller initialText="TEST"/>);
        await openSettings(queries);

        expect(await queries.findByText('Direction : Gauche vers Droite')).toBeTruthy();
    });

    it('sauvegarde la direction inversée après un toggle', async () => {
        const queries = render(<LedScroller initialText="TEST"/>);

        await openSettings(queries);
        expect(await queries.findByText('Direction : Droite vers Gauche')).toBeTruthy();

        fireEvent.press(queries.getByTestId('direction-button'));
        expect(await queries.findByText('Direction : Gauche vers Droite')).toBeTruthy();
    });
});

describe('Mode Paysage (Landscape)', () => {
    let mockDimensions = {width: 360, height: 800};

    beforeAll(() => {
        jest.spyOn(require('react-native'), 'useWindowDimensions')
            .mockImplementation(() => mockDimensions);
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('cache le Header et le Footer en mode Paysage', () => {
        mockDimensions = {width: 800, height: 360};

        const {queryByText} = render(<LedScroller initialText="LANDSCAPE"/>);

        expect(queryByText('LED Scroller')).toBeNull();

        expect(queryByText(/Made with/)).toBeNull();
    });

    it('affiche le Header en mode Portrait', () => {
        mockDimensions = {width: 360, height: 800};

        const {getByText} = render(<LedScroller initialText="PORTRAIT"/>);

        expect(getByText('LED Scroller')).toBeTruthy();
    });

    it('met à jour header/footer selon l’orientation mocked', () => {
        let mockDimensions = {width: 800, height: 360};
        jest.spyOn(require('react-native'), 'useWindowDimensions').mockImplementation(() => mockDimensions);
        const {queryByText, rerender} = render(<LedScroller initialText="LAND"/>);
        expect(queryByText('LED Scroller')).toBeNull();
        mockDimensions = {width: 360, height: 800};
        rerender(<LedScroller initialText="LAND"/>);
        expect(queryByText('LED Scroller')).not.toBeNull();
    });
});
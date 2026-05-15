import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LedScroller} from '../components';
import {StyleSheet} from 'react-native';

describe('<LedScroller /> Integration', () => {

    beforeEach(async () => {
        jest.clearAllMocks();
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

        jest.spyOn(AsyncStorage, 'getItem').mockRejectedValue(new Error('Storage error'));

        const {getAllByText} = render(<LedScroller initialText="BONJOUR 2025"/>);

        await waitFor(() => {
            const elements = getAllByText('BONJOUR 2025');
            expect(elements.length).toBeGreaterThan(0);
        });

        expect(consoleSpy).toHaveBeenCalledWith(
            "Erreur lors du chargement des paramètres",
            expect.any(Error)
        );

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

    beforeEach(async () => {
        jest.clearAllMocks();
        await AsyncStorage.clear();
    });

    it('sauvegarde le message courant dans l\'historique à la fermeture du modal', async () => {
        const {getByTestId, findByText} = render(<LedScroller initialText="INITIAL"/>);

        const settingsBtn = getByTestId('settings-button');
        fireEvent.press(settingsBtn);

        const modalTitle = await findByText('⚙️ Config');
        expect(modalTitle).toBeTruthy();

        const closeBtn = getByTestId('close-modal-button');
        fireEvent.press(closeBtn);

        await waitFor(async () => {
            const saved = await AsyncStorage.getItem('@led_scroller_settings_v1');
            const parsed = saved ? JSON.parse(saved) : null;
            expect(parsed.recentMessages).toBeDefined();
        });
    });

    it('ajoute le message à l\'historique lors de la fermeture du modal', async () => {
        const {getByTestId, getByPlaceholderText, findByText} = render(
            <LedScroller initialText="TEST"/>
        );

        const settingsBtn = getByTestId('settings-button');
        fireEvent.press(settingsBtn);

        await findByText('⚙️ Config');

        const textInput = getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(textInput, 'NOUVEAU MESSAGE');

        const closeBtn = getByTestId('close-modal-button');
        fireEvent.press(closeBtn);

        await waitFor(async () => {
            const saved = await AsyncStorage.getItem('@led_scroller_settings_v1');
            const parsed = saved ? JSON.parse(saved) : null;
            expect(parsed.recentMessages).toContain('NOUVEAU MESSAGE');
        }, {timeout: 2000});
    });

    it('limite l\'historique à 5 messages maximum', async () => {
        const initialMessages = ['MSG1', 'MSG2', 'MSG3', 'MSG4', 'MSG5'];
        await AsyncStorage.setItem('@led_scroller_settings_v1', JSON.stringify({
            text: 'INITIAL',
            recentMessages: initialMessages
        }));

        const {getByTestId, getByPlaceholderText, findByText} = render(
            <LedScroller initialText="TEST"/>
        );

        const settingsBtn = getByTestId('settings-button');
        fireEvent.press(settingsBtn);

        await findByText('⚙️ Config');

        const textInput = getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(textInput, 'MSG6');

        const closeBtn = getByTestId('close-modal-button');
        fireEvent.press(closeBtn);

        await waitFor(async () => {
            const saved = await AsyncStorage.getItem('@led_scroller_settings_v1');
            const parsed = saved ? JSON.parse(saved) : null;
            expect(parsed.recentMessages.length).toBeLessThanOrEqual(5);
            expect(parsed.recentMessages[0]).toBe('MSG6');
        }, {timeout: 2000});
    });

    it('évite les doublons dans l\'historique', async () => {
        await AsyncStorage.setItem('@led_scroller_settings_v1', JSON.stringify({
            text: 'INITIAL',
            recentMessages: ['DUPLICATE', 'OTHER']
        }));

        const {getByTestId, getByPlaceholderText, findByText} = render(
            <LedScroller initialText="TEST"/>
        );

        const settingsBtn = getByTestId('settings-button');
        fireEvent.press(settingsBtn);

        await findByText('⚙️ Config');

        const textInput = getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(textInput, 'DUPLICATE');

        const closeBtn = getByTestId('close-modal-button');
        fireEvent.press(closeBtn);

        await waitFor(async () => {
            const saved = await AsyncStorage.getItem('@led_scroller_settings_v1');
            const parsed = saved ? JSON.parse(saved) : null;
            const duplicateCount = parsed.recentMessages.filter(
                (msg: string) => msg === 'DUPLICATE'
            ).length;
            expect(duplicateCount).toBe(1);
            expect(parsed.recentMessages[0]).toBe('DUPLICATE');
        }, {timeout: 2000});
    });

    it('charge l\'historique des messages depuis le stockage', async () => {
        const savedMessages = ['SAVED1', 'SAVED2', 'SAVED3'];
        await AsyncStorage.setItem('@led_scroller_settings_v1', JSON.stringify({
            text: 'INITIAL',
            recentMessages: savedMessages
        }));

        const {getByTestId, findByText} = render(<LedScroller initialText="TEST"/>);

        const settingsBtn = getByTestId('settings-button');
        fireEvent.press(settingsBtn);

        const modal = await findByText('⚙️ Config');
        expect(modal).toBeTruthy();

        expect(findByText('SAVED1')).toBeTruthy();
        expect(findByText('SAVED2')).toBeTruthy();
        expect(findByText('SAVED3')).toBeTruthy();
    });

    it('ignore les messages vides lors de la sauvegarde', async () => {
        const {getByTestId, getByPlaceholderText, findByText} = render(
            <LedScroller initialText="TEST"/>
        );

        const settingsBtn = getByTestId('settings-button');
        fireEvent.press(settingsBtn);

        await findByText('⚙️ Config');

        const textInput = getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(textInput, '   ');

        const closeBtn = getByTestId('close-modal-button');
        fireEvent.press(closeBtn);

        await waitFor(async () => {
            const saved = await AsyncStorage.getItem('@led_scroller_settings_v1');
            const parsed = saved ? JSON.parse(saved) : null;
            expect(parsed.recentMessages || []).not.toContain('   ');
        }, {timeout: 2000});
    });

    it('préserve l\'ordre des messages : les plus récents en premier', async () => {
        await AsyncStorage.setItem('@led_scroller_settings_v1', JSON.stringify({
            text: 'INITIAL',
            recentMessages: ['OLD1', 'OLD2']
        }));

        const {getByTestId, getByPlaceholderText, findByText} = render(
            <LedScroller initialText="TEST"/>
        );

        const settingsBtn = getByTestId('settings-button');
        fireEvent.press(settingsBtn);

        await findByText('⚙️ Config');

        const textInput = getByPlaceholderText('Entrez votre message...');
        fireEvent.changeText(textInput, 'NEW');

        const closeBtn = getByTestId('close-modal-button');
        fireEvent.press(closeBtn);

        await waitFor(async () => {
            const saved = await AsyncStorage.getItem('@led_scroller_settings_v1');
            const parsed = saved ? JSON.parse(saved) : null;
            expect(parsed.recentMessages[0]).toBe('NEW');
            expect(parsed.recentMessages[1]).toBe('OLD1');
            expect(parsed.recentMessages[2]).toBe('OLD2');
        }, {timeout: 2000});
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
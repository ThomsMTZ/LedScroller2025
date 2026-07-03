import {renderHook} from '@testing-library/react-native';
import {useLedLayout} from '../../components/hooks/useLedLayout';
import * as RN from 'react-native';

describe('useLedLayout Hook', () => {
    beforeEach(() => {
        // Use default jest-react-native dimensions (width: 750, height: 1334)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('devrait calculer maxFontSize correctement en mode portrait', () => {
        const {result} = renderHook(() => useLedLayout({
            isLandscape: false,
            text: 'Hello',
        }));

        // Default dimensions: 750x1334
        // PORTRAIT_PANEL_HEIGHT = 750 * 0.6 = 450
        // maxFontSize = 450 * 0.8 = 360
        expect(result.current.maxFontSize).toBe(360);
    });

    it('devrait calculer maxFontSize correctement en mode paysage', () => {
        const {result} = renderHook(() => useLedLayout({
            isLandscape: true,
            text: 'Hello',
        }));

        // Landscape: maxFontSize = height * 0.8 = 1334 * 0.8 = 1067.2
        expect(result.current.maxFontSize).toBe(1067.2);
    });

    it('devrait retourner la constante MIN_FONT_SIZE', () => {
        const {result} = renderHook(() => useLedLayout({
            isLandscape: true,
            text: 'Hello',
        }));

        expect(result.current.MIN_FONT_SIZE).toBe(20);
    });

    it('devrait calculer le bon nombre de copies (copiesArray) pour un long texte', () => {
        const textWidth = 800; // largeur du texte
        const width = 750; // largeur de l écran
        
        const {result} = renderHook(() => useLedLayout({
            textWidth,
            isLandscape: false,
            text: 'Texte très long',
        }));

        const LOOP_SPACING = width * 0.3; // 225
        const patternWidth = textWidth + LOOP_SPACING; // 1025
        const copiesNeeded = Math.ceil(width / patternWidth) + 1; // ceil(750 / 1025) + 1 = 1 + 1 = 2

        expect(result.current.copiesArray.length).toBe(copiesNeeded);
    });

    it('devrait retourner au moins 2 copies même si le texte est très petit', () => {
        const {result} = renderHook(() => useLedLayout({
            textWidth: 10,
            isLandscape: false,
            text: 'A',
        }));

        expect(result.current.copiesArray.length).toBeGreaterThanOrEqual(2);
    });
});

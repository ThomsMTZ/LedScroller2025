import {renderHook} from '@testing-library/react-native';
import {useLedAnimation} from "../components/useLedAnimation";

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native-gesture-handler', () => ({
    Gesture: {
        Tap: jest.fn(() => ({
            numberOfTaps: jest.fn().mockReturnThis(),
            runOnJS: jest.fn().mockReturnThis(),
            onEnd: jest.fn().mockReturnThis(),
        })),
        Pinch: jest.fn(() => ({
            onUpdate: jest.fn().mockReturnThis(),
            onEnd: jest.fn().mockReturnThis(),
        })),
        Race: jest.fn(() => ({})),
    }
}));

describe('useLedAnimation Hook', () => {
    const mockProps = {
        text: 'Hello',
        speed: 100,
        isReverseScroll: false,
        isTextBlinking: false,
        isBorderBlinking: false,
        selectedColor: {hue: 0, saturation: 100, lightness: 50, name: 'Rouge'},
        isLandscape: false,
        onDoubleTap: jest.fn(),
    };

    it('devrait retourner les styles animés et la configuration des gestes', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(result.current.componentId).toBeDefined();
        expect(result.current.animatedContainerStyle).toBeDefined();
        expect(result.current.animatedTextStyle).toBeDefined();
        expect(result.current.animatedBorderColorStyle).toBeDefined();
        expect(result.current.animatedBorderOpacityStyle).toBeDefined();
        expect(result.current.animatedShadowColorStyle).toBeDefined();
        expect(result.current.composedGestures).toBeDefined();
    });

    it('devrait exposer setTextWidth et copiesArray', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(typeof result.current.setTextWidth).toBe('function');
        expect(Array.isArray(result.current.copiesArray)).toBe(true);
        expect(result.current.copiesArray.length).toBeGreaterThanOrEqual(2);
    });

    it('devrait exposer les shared values hueVal, satVal, ligVal', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(result.current.hueVal).toBeDefined();
        expect(result.current.satVal).toBeDefined();
        expect(result.current.ligVal).toBeDefined();
    });

    it('devrait initialiser hueVal/satVal/ligVal avec les valeurs de selectedColor', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(result.current.hueVal.value).toBe(0);    // hue de Rouge
        expect(result.current.satVal.value).toBe(100);  // saturation
        expect(result.current.ligVal.value).toBe(50);   // lightness
    });

    it('devrait exposer animatedBorderOpacityStyle et animatedShadowColorStyle', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(result.current.animatedBorderOpacityStyle).toBeDefined();
        expect(result.current.animatedShadowColorStyle).toBeDefined();
    });

    it('devrait retourner copiesArray avec au moins 2 éléments', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(result.current.copiesArray.length).toBeGreaterThanOrEqual(2);
    });

    it('devrait exposer LOOP_SPACING et PORTRAIT_PANEL_HEIGHT comme nombres positifs', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(result.current.LOOP_SPACING).toBeGreaterThan(0);
        expect(result.current.PORTRAIT_PANEL_HEIGHT).toBeGreaterThan(0);
    });
});
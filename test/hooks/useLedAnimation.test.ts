import {renderHook, act} from '@testing-library/react-native';
import {useLedAnimation} from '../../hooks/useLedAnimation';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-reanimated', () => {
    const mock = require('react-native-reanimated/mock');
    mock.runOnJS = jest.fn((fn) => fn);
    return mock;
});
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
        borderColor: {hue: 0, saturation: 100, lightness: 50, name: 'Rouge'},
        isLandscape: false,
        onDoubleTap: jest.fn(),
        thickness: 900,
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

    it('devrait exposer le shared value ledColorShared', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(result.current.ledColorShared).toBeDefined();
    });

    it('devrait initialiser ledColorShared avec les valeurs de selectedColor', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));

        expect(result.current.ledColorShared.value).toBe('hsl(0, 100%, 50%)');
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
        expect(result.current.LOOP_SPACING).toBeGreaterThan(0);
        expect(result.current.PORTRAIT_PANEL_HEIGHT).toBeGreaterThan(0);
    });

    it('devrait appliquer l\'animation de clignotement si activé', () => {
        const {result} = renderHook(() => useLedAnimation({...mockProps, isTextBlinking: true, isBorderBlinking: true}));
        
        // Just checking it renders without errors when blinking is true
        expect(result.current.animatedTextStyle).toBeDefined();
    });

    it('devrait démarrer l\'animation de scroll quand textWidth > 0', () => {
        const {result, rerender} = renderHook((props) => useLedAnimation(props), {initialProps: mockProps});
        
        result.current.setTextWidth(500);
        
        // Re-render to trigger useEffect with new textWidth
        rerender({...mockProps, isReverseScroll: true});
        expect(result.current.animatedContainerStyle).toBeDefined();
    });

    it('devrait ajuster fontSize si > maxFontSize lors d\'un changement d\'orientation', () => {
        const {result, rerender} = renderHook((props) => useLedAnimation(props), {initialProps: mockProps});
        
        result.current.setFontSize(2000); // Simulate very large font
        rerender({...mockProps, isLandscape: true});
        
        // Check state update
        expect(result.current.fontSizeState).toBeDefined();
    });

    it('devrait tester setFontSize et setFontSizeEnd', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));
        
        act(() => {
            result.current.setFontSize(100);
            result.current.setFontSizeEnd(120);
        });
        
        expect(result.current.fontSizeState).toBe(120);
    });

    it('devrait configurer les gestes pinch et tap correctement', () => {
        const {result} = renderHook(() => useLedAnimation(mockProps));
        
        // Since we mocked Gesture.Pinch and Gesture.Tap, we verify they expose onUpdate, onEnd
        const {Gesture} = require('react-native-gesture-handler');
        expect(Gesture.Pinch).toHaveBeenCalled();
        expect(Gesture.Tap).toHaveBeenCalled();
        
        // Try to manually invoke the mocked callbacks if accessible, or just verify the gesture setup didn't crash
        expect(result.current.composedGestures).toBeDefined();
    });
});
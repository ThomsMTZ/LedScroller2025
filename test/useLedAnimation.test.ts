import {renderHook} from '@testing-library/react-native';
import {useLedAnimations} from "../components/useLedAnimation";

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native-gesture-handler', () => ({
    Gesture: {
        Tap: jest.fn(() => ({
            numberOfTaps: jest.fn().mockReturnThis(),
            runOnJS: jest.fn().mockReturnThis(),
            onEnd: jest.fn()
        })),
        Pinch: jest.fn(() => ({onUpdate: jest.fn().mockReturnThis(), onEnd: jest.fn()})),
        Simultaneous: jest.fn(),
    }
}));

describe('useLedAnimations Hook', () => {
    it('devrait retourner les styles animés et la configuration des gestes', () => {
        const mockProps = {
            text: 'Hello',
            speed: 100,
            isReverseScroll: false,
            isTextBlinking: false,
            currentHsl: 'hsl(0, 100%, 50%)',
            onDoubleTap: jest.fn(),
        };

        const {result} = renderHook(() => useLedAnimations(mockProps));

        expect(result.current.componentId).toBeDefined();
        expect(result.current.animatedContainerStyle).toBeDefined();
        expect(result.current.animatedTextStyle).toBeDefined();
    });
});
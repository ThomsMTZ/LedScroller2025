import React from 'react';
import {render} from '@testing-library/react-native';
import {LedBorder} from "../components";

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

describe('LedBorder Component', () => {
    // Mock basique d'une SharedValue pour les tests
    const mockColorShared = { value: 'hsl(0, 100%, 50%)' } as any;

    it('ne devrait rien rendre dans le DOM si isAnimating est false', () => {
        const {toJSON} = render(
            <LedBorder colorShared={mockColorShared} isAnimating={false} speed={100}/>
        );

        expect(toJSON()).toBeNull();
    });

    it('devrait se rendre correctement si isAnimating est true', () => {
        const {UNSAFE_root} = render(
            <LedBorder colorShared={mockColorShared} isAnimating={true} speed={100}/>
        );

        expect(UNSAFE_root).toBeTruthy();
    });
});
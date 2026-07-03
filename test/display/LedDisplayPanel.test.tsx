import React from 'react';
import {render} from '@testing-library/react-native';
import LedDisplayPanel from '../../components/display/LedDisplayPanel';

// Mocks pour les composants enfants et les dépendances
jest.mock('../../components/display/LedBorder', () => 'LedBorder');
jest.mock('../../components/display/GridOverlay', () => 'GridOverlay');
jest.mock('react-native-reanimated', () => {
    const Reanimated = jest.requireActual('react-native-reanimated/mock');
    Reanimated.useSharedValue = jest.fn((v) => ({value: v}));
    return Reanimated;
});

describe('LedDisplayPanel Component', () => {

    const mockLayout = {
        isLandscape: false,
        showNativeBorder: false,
        isChaseActive: true,
    };

    const mockAnimation = {
        PORTRAIT_PANEL_HEIGHT: 800,
        animatedBorderColorStyle: {},
        animatedBorderOpacityStyle: {},
        animatedShadowColorStyle: {},
        animatedContainerStyle: {},
        animatedTextStyle: {fontSize: 100},
        borderColorShared: {value: 'hsl(0, 100%, 50%)'} as any,
        componentId: 'test-id',
        copiesArray: [1, 2],
        LOOP_SPACING: 50,
        setTextWidth: jest.fn(),
        textWidth: 0,
    };

    const mockDisplay = {
        text: 'TEST',
        speed: 100,
        thickness: 900,
    };

    it('devrait rendre le conteneur principal et le texte', () => {
        const {getByTestId, getAllByText} = render(
            <LedDisplayPanel layout={mockLayout} animation={mockAnimation} display={mockDisplay}/>
        );

        expect(getByTestId('led-display')).toBeTruthy();
        expect(getAllByText('TEST')).toHaveLength(3); // 1 invisible pour mesurer + 2 copies
    });

    it('devrait rendre LedBorder si isChaseActive est true', () => {
        const {UNSAFE_getByType} = render(
            <LedDisplayPanel layout={{...mockLayout, isChaseActive: true}} animation={mockAnimation} display={mockDisplay}/>
        );
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const LedBorderMock = require('../../components/display/LedBorder').default ?? require('../../components/display/LedBorder');
        expect(UNSAFE_getByType(LedBorderMock)).toBeTruthy();
    });

    it('ne devrait pas rendre LedBorder si isChaseActive est false', () => {
        const {UNSAFE_queryByType} = render(
            <LedDisplayPanel layout={{...mockLayout, isChaseActive: false}} animation={mockAnimation} display={mockDisplay}/>
        );
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const LedBorderMock = require('../../components/display/LedBorder').default ?? require('../../components/display/LedBorder');
        expect(UNSAFE_queryByType(LedBorderMock)).toBeNull();
    });

    it('devrait assigner le fontWeight basé sur thickness', () => {
        const {getAllByTestId} = render(
            <LedDisplayPanel
                layout={mockLayout}
                animation={mockAnimation}
                display={mockDisplay}
            />
        );

        const firstTextInstance = getAllByTestId('scrolling-text')[0];
        // font-weight expects string like "900"
        expect(firstTextInstance.props.style).toEqual(
            expect.arrayContaining([expect.objectContaining({ fontWeight: "900" })])
        );
    });
});

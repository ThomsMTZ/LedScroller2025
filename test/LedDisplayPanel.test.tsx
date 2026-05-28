import React from 'react';
import {render} from '@testing-library/react-native';
import LedDisplayPanel from '../components/LedDisplayPanel';

// Mocks pour les composants enfants et les dépendances
jest.mock('../components/LedBorder', () => 'LedBorder');
jest.mock('../components/GridOverlay', () => 'GridOverlay');
jest.mock('react-native-reanimated', () => {
    const Reanimated = jest.requireActual('react-native-reanimated/mock');
    Reanimated.useSharedValue = jest.fn((v) => ({value: v}));
    return Reanimated;
});

describe('LedDisplayPanel Component', () => {
    const mockProps = {
        isLandscape: false,
        showNativeBorder: false,
        isChaseActive: true,
        PORTRAIT_PANEL_HEIGHT: 200,
        animatedBorderColorStyle: {},
        animatedBorderOpacityStyle: {},
        animatedShadowColorStyle: {},
        animatedContainerStyle: {},
        animatedTextStyle: {fontSize: 100},
        hueVal: {value: 180},
        satVal: {value: 100},
        ligVal: {value: 50},
        speed: 100,
        componentId: 'test-id',
        text: 'TEST',
        setTextWidth: jest.fn(),
        copiesArray: [1, 2], // Simule deux copies
        LOOP_SPACING: 50,
    };

    it('devrait rendre le conteneur principal et le texte', () => {
        const {getByTestId, getAllByText} = render(<LedDisplayPanel {...mockProps} />);

        expect(getByTestId('led-display')).toBeTruthy();
        expect(getAllByText('TEST').length).toBe(2); // Basé sur copiesArray
    });

    it('devrait rendre LedBorder si isChaseActive est true', () => {
        const {UNSAFE_getByType} = render(<LedDisplayPanel {...mockProps} isChaseActive={true}/>);
        expect(UNSAFE_getByType('LedBorder')).toBeTruthy();
    });

    it('ne devrait pas rendre LedBorder si isChaseActive est false', () => {
        const {UNSAFE_queryByType} = render(<LedDisplayPanel {...mockProps} isChaseActive={false}/>);
        expect(UNSAFE_queryByType('LedBorder')).toBeNull();
    });

    it('devrait appeler setTextWidth au rendu du premier élément de texte', () => {
        const setTextWidthMock = jest.fn();
        const {getAllByTestId} = render(<LedDisplayPanel {...mockProps} setTextWidth={setTextWidthMock}/>);

        const firstTextInstance = getAllByTestId('scrolling-text')[0];
        const mockLayoutEvent = {nativeEvent: {layout: {width: 300}}};

        firstTextInstance.props.onLayout(mockLayoutEvent);

        expect(setTextWidthMock).toHaveBeenCalledWith(300);
    });
});

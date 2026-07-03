import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {ToggleButton} from "../../../components/SettingsModal/components/ToggleButton";

describe('ToggleButton Component', () => {
    const mockProps = {
        label: 'Mon Effet',
        icon: 'flash',
        isActive: false,
        onPress: jest.fn(),
        testID: 'my-toggle',
        currentHsl: 'hsl(120, 100%, 50%)',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait afficher le label correctement', () => {
        const {getByText} = render(<ToggleButton {...mockProps} />);
        expect(getByText('Mon Effet')).toBeTruthy();
    });

    it('devrait appeler onPress lors du clic', () => {
        const {getByTestId} = render(<ToggleButton {...mockProps} />);
        const button = getByTestId('my-toggle');

        fireEvent.press(button);
        expect(mockProps.onPress).toHaveBeenCalledTimes(1);
    });
});
import React from 'react';
import {render} from '@testing-library/react-native';
import {HintContainer} from "../components";

describe('HintContainer Component', () => {
    it('devrait afficher les textes d’indication pour les gestes', () => {
        const {getByText} = render(<HintContainer/>);

        expect(getByText('Double-tap: Options')).toBeTruthy();
        expect(getByText('Pinch: Zoom')).toBeTruthy();
    });
});
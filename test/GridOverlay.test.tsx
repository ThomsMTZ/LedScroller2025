import React from 'react';
import {render} from '@testing-library/react-native';
import {GridOverlay} from '../components';

describe('GridOverlay Component', () => {
    it('devrait se rendre sans erreur', () => {
        const {UNSAFE_root} = render(<GridOverlay/>);
        expect(UNSAFE_root).toBeTruthy();
    });
});
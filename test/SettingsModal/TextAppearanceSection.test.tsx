import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {TextAppearanceSection} from '../../components/SettingsModal/components/TextAppearanceSection';
import {useSettings} from '../../context/SettingsContext';
import {useTranslation} from '../../context/I18nContext';

jest.mock('../../context/SettingsContext', () => ({
    useSettings: jest.fn(),
}));

jest.mock('../../context/I18nContext', () => ({
    useTranslation: jest.fn(),
}));

describe('TextAppearanceSection Component', () => {
    const mockOnFontSizeChange = jest.fn();
    const mockOnFontSizeChangeEnd = jest.fn();
    const mockOnThicknessChange = jest.fn();

    beforeEach(() => {
        (useSettings as jest.Mock).mockReturnValue({
            fontSize: 200,
            maxFontSize: 400,
            minFontSize: 20,
            onFontSizeChange: mockOnFontSizeChange,
            onFontSizeChangeEnd: mockOnFontSizeChangeEnd,
            thickness: 900,
            onThicknessChange: mockOnThicknessChange,
            currentHsl: 'hsl(0, 100%, 50%)',
        });

        (useTranslation as jest.Mock).mockReturnValue({
            t: {
                textSizeLabel: 'Taille du texte',
                textThicknessLabel: 'Épaisseur',
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('devrait se rendre correctement et afficher les labels', () => {
        const {getByText} = render(<TextAppearanceSection />);

        expect(getByText('Taille & Épaisseur')).toBeTruthy();
        expect(getByText('Taille du texte')).toBeTruthy();
        expect(getByText('Épaisseur')).toBeTruthy();
    });

    it('devrait appeler onFontSizeChange et onFontSizeChangeEnd via les boutons et le slider', () => {
        const {getByTestId} = render(<TextAppearanceSection />);
        const sizeSlider = getByTestId('size-slider');

        fireEvent(sizeSlider, 'valueChange', 250);
        expect(mockOnFontSizeChange).toHaveBeenCalledWith(250);
        
        fireEvent(sizeSlider, 'slidingComplete', 250);
        expect(mockOnFontSizeChangeEnd).toHaveBeenCalledWith(250);
    });

    it('devrait appeler onThicknessChange via le slider épaisseur', () => {
        const {getByTestId} = render(<TextAppearanceSection />);
        const thicknessSlider = getByTestId('thickness-slider');

        fireEvent(thicknessSlider, 'valueChange', 700);
        expect(mockOnThicknessChange).toHaveBeenCalledWith(700);
    });
});

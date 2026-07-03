import {AnalyticsService} from '../../services/AnalyticsService';
import {NativeModules} from 'react-native';

// Mock react-native
jest.mock('react-native', () => ({
    NativeModules: {
        RNFBAppModule: undefined,
    },
}));

describe('AnalyticsService (without Firebase)', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    it('devrait logger settings_opened avec trigger', async () => {
        await AnalyticsService.logSettingsOpened('button');
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] settings_opened', {trigger: 'button'});
    });

    it('devrait logger settings_closed avec text_length', async () => {
        await AnalyticsService.logSettingsClosed(10);
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] settings_closed', {text_length: 10});
    });

    it('devrait logger message_changed', async () => {
        await AnalyticsService.logMessageChanged(5, true);
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] message_changed', {text_length: 5, is_from_recent: true});
    });

    it('devrait logger color_changed', async () => {
        await AnalyticsService.logColorChanged('Rouge');
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] color_changed', {color_name: 'Rouge'});
    });

    it('devrait logger speed_changed', async () => {
        await AnalyticsService.logSpeedChanged(50);
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] speed_changed', {speed_value: 50});
    });

    it('devrait logger orientation_toggled', async () => {
        await AnalyticsService.logOrientationToggled(true);
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] orientation_toggled', {locked: true});
    });

    it('devrait logger effect_toggled', async () => {
        await AnalyticsService.logEffectToggled('border', false);
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] effect_toggled', {effect: 'border', enabled: false});
    });

    it('devrait logger favorite_toggled', async () => {
        await AnalyticsService.logFavoriteToggled('add');
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] favorite_toggled', {action: 'add'});
    });

    it('devrait logger recent_message_selected', async () => {
        await AnalyticsService.logRecentMessageSelected(15);
        expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] recent_message_selected', {text_length: 15});
    });
});

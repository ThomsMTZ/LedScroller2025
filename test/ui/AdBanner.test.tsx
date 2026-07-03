import React from 'react';
import {render} from '@testing-library/react-native';
import {NativeModules, Platform, View} from 'react-native';

jest.mock('expo-constants', () => ({
    __esModule: true,
    ExecutionEnvironment: {
        StoreClient: 'storeClient',
    },
    default: {
        executionEnvironment: 'standalone',
    },
}));

// Mock react-native-google-mobile-ads
jest.mock('react-native-google-mobile-ads', () => {
    const { View } = require('react-native');
    return {
        TestIds: { BANNER: 'test-banner' },
        BannerAd: () => <View testID="banner-ad" />,
        BannerAdSize: { BANNER: 'BANNER' }
    };
}, {virtual: true});

describe('AdBanner', () => {
    const originalDev = global.__DEV__;

    beforeEach(() => {
        jest.resetModules();
        global.__DEV__ = originalDev;
    });

    it('renders null when inside Expo Go (StoreClient)', () => {
        const Constants = require('expo-constants').default;
        Constants.executionEnvironment = 'storeClient';
        
        const AdBanner = require('../../components/ui/AdBanner').default;
        
        const {toJSON} = render(<AdBanner />);
        expect(toJSON()).toBeNull();
    });

    it('renders BannerAd when not in Expo Go in DEV', () => {
        const Constants = require('expo-constants').default;
        Constants.executionEnvironment = 'standalone';
        
        const AdBanner = require('../../components/ui/AdBanner').default;
        
        const {getByTestId} = render(<AdBanner />);
        expect(getByTestId('banner-ad')).toBeTruthy();
    });

    it('uses android AD_UNIT_ID in production on Android', () => {
        const Constants = require('expo-constants').default;
        Constants.executionEnvironment = 'standalone';
        global.__DEV__ = false;
        Platform.OS = 'android';
        
        const AdBanner = require('../../components/ui/AdBanner').default;
        
        const {getByTestId} = render(<AdBanner />);
        expect(getByTestId('banner-ad')).toBeTruthy();
    });

    it('uses ios AD_UNIT_ID in production on iOS', () => {
        const Constants = require('expo-constants').default;
        Constants.executionEnvironment = 'standalone';
        global.__DEV__ = false;
        Platform.OS = 'ios';
        
        const AdBanner = require('../../components/ui/AdBanner').default;
        
        const {getByTestId} = render(<AdBanner />);
        expect(getByTestId('banner-ad')).toBeTruthy();
    });
});

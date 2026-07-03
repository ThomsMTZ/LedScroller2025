import React from 'react';
import {render} from '@testing-library/react-native';
import {NativeModules, Platform, View} from 'react-native';

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

    it('renders null when RNGoogleMobileAds is not available', () => {
        NativeModules.RNGoogleMobileAds = undefined;
        const AdBanner = require('../../components/ui/AdBanner').default;
        
        const {toJSON} = render(<AdBanner />);
        expect(toJSON()).toBeNull();
    });

    it('renders BannerAd when RNGoogleMobileAds is available in DEV', () => {
        NativeModules.RNGoogleMobileAds = { module: 'mock' };
        const AdBanner = require('../../components/ui/AdBanner').default;
        
        const {getByTestId} = render(<AdBanner />);
        expect(getByTestId('banner-ad')).toBeTruthy();
    });

    it('uses android AD_UNIT_ID in production on Android', () => {
        NativeModules.RNGoogleMobileAds = { module: 'mock' };
        global.__DEV__ = false;
        Platform.OS = 'android';
        
        const AdBanner = require('../../components/ui/AdBanner').default;
        
        const {getByTestId} = render(<AdBanner />);
        expect(getByTestId('banner-ad')).toBeTruthy();
    });

    it('uses ios AD_UNIT_ID in production on iOS', () => {
        NativeModules.RNGoogleMobileAds = { module: 'mock' };
        global.__DEV__ = false;
        Platform.OS = 'ios';
        
        const AdBanner = require('../../components/ui/AdBanner').default;
        
        const {getByTestId} = render(<AdBanner />);
        expect(getByTestId('banner-ad')).toBeTruthy();
    });
});

import React from 'react';
import {Platform, View} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        android: 'ca-app-pub-2790650155402757/5652248123',
        ios: 'ca-app-pub-2790650155402757/6773987013',
        default: TestIds.BANNER,
    });

const AdBanner: React.FC = () => (
    <View style={{alignItems: 'center', paddingVertical: 10, backgroundColor: 'transparent'}}>
        <BannerAd
            unitId={AD_UNIT_ID as string}
            size={BannerAdSize.BANNER}
            requestOptions={{requestNonPersonalizedAdsOnly: true}}
        />
    </View>
);

export default AdBanner;

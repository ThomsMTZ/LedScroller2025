import React from 'react';
import {NativeModules, Platform, View} from 'react-native';

// react-native-google-mobile-ads est un module natif indisponible dans Expo Go.
// On garde l'import statique absent et on charge le module en lazy seulement
// si le module natif est présent, pour éviter le crash au boot.
const isAdsAvailable = !!NativeModules.RNGoogleMobileAds;

// Chargement lazy : réalisé une seule fois en dehors du composant.
// Si le module natif est absent, AdsModule reste null et le composant rend null.
type AdsModuleType = typeof import('react-native-google-mobile-ads');
const AdsModule: AdsModuleType | null = isAdsAvailable
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ? require('react-native-google-mobile-ads')
    : null;

const getAdUnitId = () => {
    if (!AdsModule) return null;
    if (__DEV__) return AdsModule.TestIds.BANNER;
    return Platform.select({
        android: 'ca-app-pub-2790650155402757/5652248123',
        ios: 'ca-app-pub-2790650155402757/6773987013',
        default: AdsModule.TestIds.BANNER,
    });
};

const AD_UNIT_ID = getAdUnitId();

const AdBanner: React.FC = () => {
    if (!AdsModule || !AD_UNIT_ID) return null;

    const {BannerAd, BannerAdSize} = AdsModule;

    return (
        <View style={{width: '100%', alignItems: 'center', paddingVertical: 10, backgroundColor: 'transparent'}}>
            <BannerAd
                unitId={AD_UNIT_ID as string}
                size={BannerAdSize.BANNER}
                requestOptions={{requestNonPersonalizedAdsOnly: true}}
            />
        </View>
    );
};

export default AdBanner;

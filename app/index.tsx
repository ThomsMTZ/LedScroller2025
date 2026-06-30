import React, { useEffect } from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Codystar_400Regular, useFonts} from '@expo-google-fonts/codystar';
import * as SystemUI from 'expo-system-ui';
import {LedScroller} from '../components';

import {I18nProvider} from '../context/I18nContext';

export default function App() {
    useEffect(() => {
        SystemUI.setBackgroundColorAsync('black');
    }, []);

    const [fontsLoaded] = useFonts({
        'LedFont': Codystar_400Regular,
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00d4ff"/>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{flex: 1, backgroundColor: 'black'}}>
            <I18nProvider>
                <LedScroller/>
            </I18nProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
    },
});
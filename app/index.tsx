import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Codystar_400Regular, useFonts} from '@expo-google-fonts/codystar';
import {LedScroller} from '../components';

export default function App() {
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
        <GestureHandlerRootView style={{flex: 1}}>
            <LedScroller/>
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
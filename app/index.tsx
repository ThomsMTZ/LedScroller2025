import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Codystar_400Regular } from '@expo-google-fonts/codystar';
import { LedScroller } from './components';

export default function App() {
    // 2. Hook de chargement
    let [fontsLoaded] = useFonts({
        'LedFont': Codystar_400Regular,
    });

    // 3. Écran de chargement (Splash Screen temporaire)
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00FF41" />
            </View>
        );
    }

    // 4. Une fois chargé, on affiche l'app normalement
    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
            <LedScroller />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Fond noir pour éviter le flash blanc
    },
});
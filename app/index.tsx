import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LedScroller} from './components';

// --- COMPOSANT PRINCIPAL ---

export default function App() {
    // GestureHandlerRootView est requis à la racine pour la gestion des gestes avancés
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <LedScroller />
        </GestureHandlerRootView>
    );
}
/* eslint-disable import/prefer-default-export */
import {Dimensions, StyleSheet} from 'react-native';
import {Styles} from './types';

const {width} = Dimensions.get('window');

export const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    interactiveArea: {
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    scroller: {
        flexDirection: 'row',
        minWidth: width * 2
    },
    textBase: {
        fontWeight: 'bold',
        fontFamily: 'LedFont',
        includeFontPadding: false,
        textShadowRadius: 15,
        textShadowOffset: { width: 0, height: 0 },
        color: '#00FF41',
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: 10,
        opacity: 0.2,
        // Astuce future: mettre une image de grille ici
    },
    hintContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        opacity: 0.4,
    },
    hintText: {
        color: '#fff',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 2
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        paddingBottom: 50
    },
    headerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        fontSize: 18,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20
    },
    label: {
        color: '#aaa',
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 10
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15
    },
    colorDot: {
        width: 45,
        height: 45,
        borderRadius: 25,
        borderColor: '#fff'
    },
});

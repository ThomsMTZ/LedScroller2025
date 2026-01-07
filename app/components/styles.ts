import { Dimensions, StyleSheet } from 'react-native';
import { Styles } from './types';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        backgroundColor: '#050505',

        justifyContent: 'center',
        alignItems: 'center',
    },
    interactiveArea: {
        width: '100%',
        height: '35%',

        justifyContent: 'center',
        overflow: 'hidden',

        backgroundColor: '#1a1a1a',

        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: '#222',
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
        zIndex: 50,
        elevation: 50,
    },
    hintContainer: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        alignItems: 'center',
        opacity: 0.6,
    },
    hintText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
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
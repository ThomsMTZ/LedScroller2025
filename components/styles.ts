import {Platform, StyleSheet} from 'react-native';
import {COLORS} from './constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 20,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    headerSubtitle: {
        color: COLORS.textMuted,
        fontSize: 12,
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginTop: 2,
    },
    settingsButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    settingsButtonLandscape: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        zIndex: 100,
    },
    interactiveArea: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    ledDisplay: {
        borderWidth: 2,
        borderRadius: 16,
        padding: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    ledBorder: {
        borderRadius: 16,
        overflow: 'hidden',
        paddingVertical: 0,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    scroller: {
        flexDirection: 'row',
    },
    measureWrapper: {
        position: 'absolute',
        opacity: 0,
        top: 0,
        left: 0,
        width: 9999,
    },
    textBase: {
        fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-CondensedBlack' : 'sans-serif-black',
        fontWeight: '900',
        includeFontPadding: false,
        flexShrink: 0,
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: 50,
        elevation: 50,
    },
    hintContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 8,
        opacity: 0.6,
    },
    hintIcon: {
        marginRight: 4,
    },
    hintText: {
        color: COLORS.textMuted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: '500',
    },
    footer: {
        paddingBottom: 30,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: 12,
        letterSpacing: 1,
    },
});
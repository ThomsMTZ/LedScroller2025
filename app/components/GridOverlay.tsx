import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';

const GridOverlay: React.FC = () => {
    return <View style={styles.gridOverlay} pointerEvents="none" />;
};

export default GridOverlay;

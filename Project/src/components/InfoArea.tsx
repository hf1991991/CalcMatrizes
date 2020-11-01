import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import MatrixArea from './MatrixArea';
import { useCalculator } from '../hooks/useCalculator';

const InfoArea: React.FC = () => {
    const { onPressInfoAreaBackground, fullScreenDeterminant } = useCalculator();

    return (
        <TouchableWithoutFeedback 
            onPress={onPressInfoAreaBackground} 
            disabled={fullScreenDeterminant}
        >
            <View style={{ flex: 1 }}>
                <MatrixArea />
            </View>
        </TouchableWithoutFeedback>
    );
}

export default InfoArea;
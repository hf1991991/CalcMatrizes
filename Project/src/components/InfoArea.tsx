import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import MatrixArea from './MatrixArea';
import { useCalculator } from '../hooks/useCalculator';

const InfoArea: React.FC = () => {
    const { onPressInfoAreaBackground } = useCalculator();

    return (
        <TouchableWithoutFeedback onPress={onPressInfoAreaBackground}>
            <View style={{ flex: 1 }}>
                <MatrixArea />
            </View>
        </TouchableWithoutFeedback>
    );
}

export default InfoArea;
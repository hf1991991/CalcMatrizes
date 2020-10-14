import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import MatrixArea from './MatrixArea';
import { useCalculator } from '../hooks/useCalculator';

export default function InfoArea() {
    const { onPressInfoAreaBackground } = useCalculator();

    return (
        <TouchableWithoutFeedback onPress={onPressInfoAreaBackground}>
            <View style={{ flex: 1 }}>
                <MatrixArea />
            </View>
        </TouchableWithoutFeedback>
    );
}
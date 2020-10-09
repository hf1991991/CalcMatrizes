import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CalculatorButton from './CalculatorButton';
import { CalcState, ButtonType } from '../utilities/constants';

import { useCalculator } from '../hooks/useCalculator';

export default function ButtonsArea() {
    const { 
        calcState, 
        getNumberWritten,
        editableOperatorNumber,
        isNumberKeyboardActive,
        selectedMatrixElement,
        secondSetOfKeysActive, 
        isRActive,
        isVariableKeyboardActive
    } = useCalculator();

    const [buttonsAreaWidth, changeButtonsAreaWidth] = useState(0);

    const styles = StyleSheet.create({
        button: {
            height: (buttonsAreaWidth/4)*0.7,
            flexDirection: 'row',
            marginVertical: 3,
            marginHorizontal: 6
        },
    });
    
    return (
        <View
            onLayout={(event) => {
                changeButtonsAreaWidth(event.nativeEvent.layout.width);
            }}
            style={{
                marginBottom: 10
            }}
        >
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    buttonType={
                        (getNumberWritten({ doNotStringify: true }) == 0) || calcState === CalcState.ready
                            ? ButtonType.AC
                            : ButtonType.CE
                    }
                />
                <CalculatorButton
                    buttonType={
                        isNumberKeyboardActive
                            ? ButtonType.abc
                            : ButtonType.R
                    }
                />
                <CalculatorButton
                    buttonType={ButtonType.Second}
                />
                <CalculatorButton
                    buttonType={
                        isNumberKeyboardActive
                            ? ButtonType.Divide
                            : isRActive 
                                ? ButtonType.XxBeA
                                : secondSetOfKeysActive
                                    ? ButtonType.Transposed
                                    : ButtonType.Inverse
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.g
                            : ButtonType[7]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.h
                            : ButtonType[8]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.i
                            : ButtonType[9]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isNumberKeyboardActive
                            ? ButtonType.Multiply
                            : isRActive 
                                ? ButtonType.XxAeB
                                : secondSetOfKeysActive
                                    ? ButtonType.GaussianElimination
                                    : ButtonType.LambdaxA
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.d
                            : ButtonType[4]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.e
                            : ButtonType[5]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.f
                            : ButtonType[6]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isNumberKeyboardActive
                            ? ButtonType.Subtract
                            : isRActive 
                                ? ButtonType.BxXeA
                                : secondSetOfKeysActive
                                    ? ButtonType.BxA
                                    : ButtonType.AxB
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.a
                            : ButtonType[1]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.b
                            : ButtonType[2]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.c
                            : ButtonType[3]
                    }
                />
                <CalculatorButton
                    buttonType={
                        isNumberKeyboardActive
                            ? ButtonType.Add
                            : isRActive 
                                ? ButtonType.AxXeB
                                : secondSetOfKeysActive
                                    ? ButtonType.SubtractMatrix
                                    : ButtonType.AddMatrix
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    buttonType={ButtonType[0]}
                />
                <CalculatorButton
                    buttonType={ButtonType.Comma}
                />
                <CalculatorButton
                    buttonType={
                        selectedMatrixElement || editableOperatorNumber !== null
                            ? ButtonType.Enter
                            : ButtonType.Check
                    }
                />
            </View>
        </View>
    );
}
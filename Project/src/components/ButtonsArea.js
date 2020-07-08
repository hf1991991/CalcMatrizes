import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CalculatorButton from './CalculatorButton';
import { MatrixState, ButtonType } from '../utilities/constants';
import { ElementData } from '../utilities/ExpressionClasses';

export default function ButtonsArea(props) {
    const { 
        hidden,
        matrixState, 
        numberWritten,
        secondSetOfKeysActive, 
        selectedMatrixElement,
        operatorsActive,
        editableOperatorNumber,
        isRActive,
        isKeyboardBeActive,
        isVariableKeyboardActive=true,
    } = props;

    let [buttonsAreaWidth, changeButtonsAreaWidth] = useState(0);

    const styles = StyleSheet.create({
        button: {
            height: (buttonsAreaWidth/4)*0.7,
            flexDirection: 'row',
            marginVertical: 3,
            marginHorizontal: 6,
        },
    });
    
    return (
        <View
            style={{
                display: hidden && 'none',
            }}
            onLayout={(event) => {
                changeButtonsAreaWidth(event.nativeEvent.layout.width);
            }}
        >
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    {...props}
                    buttonType={
                        (numberWritten !== null && numberWritten.commaStringify() === '0') || matrixState === MatrixState.ready
                            ? ButtonType.AC
                            : ButtonType.CE
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        isKeyboardBeActive
                            ? ButtonType.abc
                            : ButtonType.R
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType.Second}
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        operatorsActive
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
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.g
                            : ButtonType[7]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.h
                            : ButtonType[8]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.i
                            : ButtonType[9]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        operatorsActive
                            ? ButtonType.Multiply
                            : isRActive 
                                ? ButtonType.XxAeB
                                : ButtonType.LambdaxA
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.d
                            : ButtonType[4]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.e
                            : ButtonType[5]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.f
                            : ButtonType[6]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        operatorsActive
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
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.a
                            : ButtonType[1]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.b
                            : ButtonType[2]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        isVariableKeyboardActive 
                            ? ButtonType.c
                            : ButtonType[3]
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        operatorsActive
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
                    {...props}
                    style={{
                        flex: 2,
                    }}
                    buttonType={ButtonType[0]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType.Comma}
                />
                <CalculatorButton
                    {...props}
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
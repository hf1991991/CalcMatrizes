import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import CalculatorButton from './CalculatorButton';
import MatrixOperations from '../utilities/MatrixOperations';
import { MatrixState, ButtonType } from '../utilities/constants';
import MatrixData from '../utilities/MatrixData';

const windowWidth = Dimensions.get('window').width;

export default function ButtonsArea(props) {
    const { 
        matrixState, 
        numberWritten,
        secondSetOfKeysActive, 
        selectedMatrixElement,
    } = props;
    return (
        <>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    {...props}
                    buttonType={
                        numberWritten 
                            ? ButtonType.CE
                            : ButtonType.AC
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        matrixState == MatrixState.ready 
                            ? ButtonType.Save
                            : ButtonType.SavedList
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        matrixState == MatrixState.ready 
                            ? ButtonType.Second
                            : ButtonType.ColumnDirection
                    }
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        matrixState == MatrixState.ready 
                            ? secondSetOfKeysActive
                                ? ButtonType.LambdaxA
                                : ButtonType.R
                            : ButtonType.Divide
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[7]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[8]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[9]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        matrixState == MatrixState.ready 
                            ? secondSetOfKeysActive
                                ? ButtonType.BxA
                                : ButtonType.AxB
                            : ButtonType.Multiply
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[4]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[5]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[6]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType.Subtract}
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[1]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[2]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType[3]}
                />
                <CalculatorButton
                    {...props}
                    buttonType={ButtonType.Add}
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
                        matrixState == MatrixState.ready 
                            ? secondSetOfKeysActive
                                ? ButtonType.Transposed
                                : ButtonType.Inverse
                            : selectedMatrixElement
                                ? ButtonType.Enter
                                : ButtonType.Check
                    }
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        height: (windowWidth/4)*0.75,
        flexDirection: 'row',
        marginVertical: 6,
        marginHorizontal: 6,
    },
});
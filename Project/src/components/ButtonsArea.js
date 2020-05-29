import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import CalculatorButton from './CalculatorButton';
import MatrixOperations from '../utilities/MatrixOperations';
import { MatrixState } from '../utilities/constants';
import MatrixData from '../utilities/MatrixData';

const windowWidth = Dimensions.get('window').width;

export default function ButtonsArea({ 
    matrixState, 
    numberWritten,
    onPressAC,
    onPressCE,
    numberButtonPressed,
    onEnter,
    onCheck,
    isMatrixFull,
    secondSetOfKeysActive, 
    changeSecondSetOfKeysActive, 
    columnDirectionActive,
    changeColumnDirectionActive,
    selectedMatrixElement,
    currentMatrix,
    changeCurrentMatrix,
}) {
    return (
        <>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    source={
                        numberWritten 
                            ? require('../../assets/buttons/CE.png')
                            : require('../../assets/buttons/AC.png')
                    }
                    onPress={
                        numberWritten
                            ? onPressCE
                            : onPressAC
                    }
                />
                <CalculatorButton
                    source={
                        matrixState == MatrixState.ready
                            ? require('../../assets/buttons/Save.png')
                            : require('../../assets/buttons/SavedList.png')
                    }
                />
                <CalculatorButton
                    source={
                        secondSetOfKeysActive
                            ? require('../../assets/buttons/ActiveSecond.png')
                            : require('../../assets/buttons/InactiveSecond.png')
                    }
                    source={
                        matrixState == MatrixState.ready
                            ? secondSetOfKeysActive
                                ? require('../../assets/buttons/ActiveSecond.png')
                                : require('../../assets/buttons/InactiveSecond.png')
                            : columnDirectionActive
                                ? require('../../assets/buttons/ActiveColumnDirection.png')
                                : require('../../assets/buttons/InactiveColumnDirection.png')
                    }
                    onPress={
                        matrixState == MatrixState.ready
                            ? changeSecondSetOfKeysActive
                            : changeColumnDirectionActive
                    }
                />
                <CalculatorButton
                    source={
                        matrixState == MatrixState.ready
                            ? secondSetOfKeysActive
                                ? require('../../assets/buttons/LambdaxA.png')
                                : require('../../assets/buttons/R.png')
                            : require('../../assets/buttons/Divide.png')
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    source={require('../../assets/buttons/7.png')}
                    onPress={() => numberButtonPressed(7)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/8.png')}
                    onPress={() => numberButtonPressed(8)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/9.png')}
                    onPress={() => numberButtonPressed(9)}
                />
                <CalculatorButton
                    source={
                        matrixState == MatrixState.ready
                            ? secondSetOfKeysActive
                                ? require('../../assets/buttons/BxA.png')
                                : require('../../assets/buttons/AxB.png')
                            : require('../../assets/buttons/Multiply.png')
                    }
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    source={require('../../assets/buttons/4.png')}
                    onPress={() => numberButtonPressed(4)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/5.png')}
                    onPress={() => numberButtonPressed(5)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/6.png')}
                    onPress={() => numberButtonPressed(6)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/Subtract.png')}
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    source={require('../../assets/buttons/1.png')}
                    onPress={() => numberButtonPressed(1)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/2.png')}
                    onPress={() => numberButtonPressed(2)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/3.png')}
                    onPress={() => numberButtonPressed(3)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/Add.png')}
                />
            </View>
            <View 
                style={styles.button}
            >
                <CalculatorButton
                    style={{
                        flex: 2,
                    }}
                    source={require('../../assets/buttons/0.png')}
                    onPress={() => numberButtonPressed(0)}
                />
                <CalculatorButton
                    source={require('../../assets/buttons/Comma.png')}
                    onPress={() => numberButtonPressed(',')}
                />
                <CalculatorButton
                    source={
                        matrixState == MatrixState.ready
                            ? secondSetOfKeysActive
                                ? require('../../assets/buttons/Transposed.png')
                                : require('../../assets/buttons/Inverse.png')
                            : selectedMatrixElement
                                ? require('../../assets/buttons/Enter.png')
                                : require('../../assets/buttons/Check.png')
                    }
                    disabled={
                        matrixState != MatrixState.ready && !selectedMatrixElement && !isMatrixFull
                    }
                    onPress={
                        matrixState == MatrixState.ready
                            ? secondSetOfKeysActive
                                ? () => {
                                    changeCurrentMatrix(
                                        new MatrixData({
                                            data: MatrixOperations.transpose(currentMatrix)
                                        })
                                    );
                                }
                                : () => {}
                            : selectedMatrixElement
                                ? onEnter
                                : onCheck
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
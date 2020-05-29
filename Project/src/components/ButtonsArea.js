import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Button from './Button';
import MatrixOperations from '../utilities/MatrixOperations';
import { KeyboardState } from '../utilities/constants';
import MatrixData from '../utilities/MatrixData';

const windowWidth = Dimensions.get('window').width;

export default function ButtonsArea({ 
    keyboardState, 
    numberWritten,
    onPressAC,
    onPressCE,
    numberButtonPressed,
    onEnter,
    secondSetOfKeysActive, 
    changeSecondSetOfKeysActive, 
    columnDirectionActive,
    changeColumnDirectionActive,
    currentMatrix,
    changeCurrentMatrix,
}) {
    return (
        <>
            <View 
                style={styles.button}
            >
                <Button
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
                <Button
                    source={
                        keyboardState == KeyboardState.matrixReady
                            ? require('../../assets/buttons/Save.png')
                            : require('../../assets/buttons/SavedList.png')
                    }
                />
                <Button
                    source={
                        secondSetOfKeysActive
                            ? require('../../assets/buttons/ActiveSecond.png')
                            : require('../../assets/buttons/InactiveSecond.png')
                    }
                    source={
                        keyboardState == KeyboardState.matrixReady
                            ? secondSetOfKeysActive
                                ? require('../../assets/buttons/ActiveSecond.png')
                                : require('../../assets/buttons/InactiveSecond.png')
                            : columnDirectionActive
                                ? require('../../assets/buttons/ActiveColumnDirection.png')
                                : require('../../assets/buttons/InactiveColumnDirection.png')
                    }
                    onPress={
                        keyboardState == KeyboardState.matrixReady
                            ? changeSecondSetOfKeysActive
                            : changeColumnDirectionActive
                    }
                />
                <Button
                    source={
                        keyboardState == KeyboardState.matrixReady
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
                <Button
                    source={require('../../assets/buttons/7.png')}
                    onPress={() => numberButtonPressed(7)}
                />
                <Button
                    source={require('../../assets/buttons/8.png')}
                    onPress={() => numberButtonPressed(8)}
                />
                <Button
                    source={require('../../assets/buttons/9.png')}
                    onPress={() => numberButtonPressed(9)}
                />
                <Button
                    source={
                        keyboardState == KeyboardState.matrixReady
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
                <Button
                    source={require('../../assets/buttons/4.png')}
                    onPress={() => numberButtonPressed(4)}
                />
                <Button
                    source={require('../../assets/buttons/5.png')}
                    onPress={() => numberButtonPressed(5)}
                />
                <Button
                    source={require('../../assets/buttons/6.png')}
                    onPress={() => numberButtonPressed(6)}
                />
                <Button
                    source={require('../../assets/buttons/Subtract.png')}
                />
            </View>
            <View 
                style={styles.button}
            >
                <Button
                    source={require('../../assets/buttons/1.png')}
                    onPress={() => numberButtonPressed(1)}
                />
                <Button
                    source={require('../../assets/buttons/2.png')}
                    onPress={() => numberButtonPressed(2)}
                />
                <Button
                    source={require('../../assets/buttons/3.png')}
                    onPress={() => numberButtonPressed(3)}
                />
                <Button
                    source={require('../../assets/buttons/Add.png')}
                />
            </View>
            <View 
                style={styles.button}
            >
                <Button
                    style={{
                        flex: 2,
                    }}
                    source={require('../../assets/buttons/0.png')}
                    onPress={() => numberButtonPressed(0)}
                />
                <Button
                    source={require('../../assets/buttons/Comma.png')}
                    onPress={() => numberButtonPressed(',')}
                />
                <Button
                    source={
                        keyboardState == KeyboardState.matrixReady
                            ? secondSetOfKeysActive
                                ? require('../../assets/buttons/Transposed.png')
                                : require('../../assets/buttons/Inverse.png')
                            : require('../../assets/buttons/Enter.png')
                    }
                    onPress={
                        keyboardState == KeyboardState.matrixReady
                            ? secondSetOfKeysActive
                                ? () => {
                                    changeCurrentMatrix(
                                        new MatrixData({
                                            data: MatrixOperations.transpose(currentMatrix)
                                        })
                                    );
                                }
                                : () => {}
                            : onEnter
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
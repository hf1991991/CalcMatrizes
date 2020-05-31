import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CalculatorButton from './CalculatorButton';
import { MatrixState, ButtonType } from '../utilities/constants';

export default function ButtonsArea(props) {
    const { 
        hidden,
        matrixState, 
        numberWritten,
        secondSetOfKeysActive, 
        selectedMatrixElement,
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
                    buttonType={ButtonType.Second}
                />
                <CalculatorButton
                    {...props}
                    buttonType={
                        secondSetOfKeysActive
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
                    buttonType={ButtonType.LambdaxA}
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
                    buttonType={
                        secondSetOfKeysActive
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
                    buttonType={
                        secondSetOfKeysActive
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
                        matrixState == MatrixState.ready 
                            ? ButtonType.R
                            : selectedMatrixElement
                                ? ButtonType.Enter
                                : ButtonType.Check
                    }
                />
            </View>
        </View>
    );
}
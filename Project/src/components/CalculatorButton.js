import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ButtonType, MatrixState } from '../utilities/constants';
import ButtonData from '../utilities/ButtonData';

export default function CalculatorButton(props) {

    function getButtonData() {
        switch (props.buttonType) {
            case ButtonType[0]:
                return new ButtonData({
                    source: require('../../assets/buttons/0.png'), 
                    style: {flex: 2},
                    onPress: () => props.numberButtonPressed(0),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[1]:
                return new ButtonData({
                    source: require('../../assets/buttons/1.png'), 
                    onPress: () => props.numberButtonPressed(1),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[2]:
                return new ButtonData({
                    source: require('../../assets/buttons/2.png'), 
                    onPress: () => props.numberButtonPressed(2),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[3]:
                return new ButtonData({
                    source: require('../../assets/buttons/3.png'), 
                    onPress: () => props.numberButtonPressed(3),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[4]:
                return new ButtonData({
                    source: require('../../assets/buttons/4.png'), 
                    onPress: () => props.numberButtonPressed(4),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[5]:
                return new ButtonData({
                    source: require('../../assets/buttons/5.png'), 
                    onPress: () => props.numberButtonPressed(5),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[6]:
                return new ButtonData({
                    source: require('../../assets/buttons/6.png'), 
                    onPress: () => props.numberButtonPressed(6),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[7]:
                return new ButtonData({
                    source: require('../../assets/buttons/7.png'), 
                    onPress: () => props.numberButtonPressed(7),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[8]:
                return new ButtonData({
                    source: require('../../assets/buttons/8.png'), 
                    onPress: () => props.numberButtonPressed(8),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType[9]:
                return new ButtonData({
                    source: require('../../assets/buttons/9.png'), 
                    onPress: () => props.numberButtonPressed(9),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType.Comma:
                return new ButtonData({
                    source: require('../../assets/buttons/Comma.png'), 
                    onPress: () => props.numberButtonPressed(','),
                    disabled: !props.selectedMatrixElement,
                });
            case ButtonType.AC:
                return new ButtonData({
                    source: require('../../assets/buttons/AC.png'), 
                    onPress: props.onPressAC,
                });
            case ButtonType.CE:
                return new ButtonData({
                    source: require('../../assets/buttons/CE.png'), 
                    onPress: props.onPressCE,
                });
            case ButtonType.Save:
                return new ButtonData({
                    source: require('../../assets/buttons/Save.png'), 
                });
            case ButtonType.SavedList:
                return new ButtonData({
                    source: require('../../assets/buttons/SavedList.png'), 
                });
            case ButtonType.Second:
                return new ButtonData({
                    source: require('../../assets/buttons/InactiveSecond.png'),
                    sourceActive: require('../../assets/buttons/ActiveSecond.png'),
                    active: props.secondSetOfKeysActive,
                    onPress: props.changeSecondSetOfKeysActive,
                });
            case ButtonType.ColumnDirection:
                return new ButtonData({
                    source: require('../../assets/buttons/InactiveColumnDirection.png'),
                    sourceActive: require('../../assets/buttons/ActiveColumnDirection.png'),
                    active: props.columnDirectionActive,
                    onPress: props.changeColumnDirectionActive,
                });
            case ButtonType.R:
                return new ButtonData({
                    source: require('../../assets/buttons/R.png'),
                    sourceActive: require('../../assets/buttons/RSelected.png'),
                    active: false,
                    disabled: !props.isMatrixFull,
                });
            case ButtonType.LambdaxA:
                return new ButtonData({
                    source: require('../../assets/buttons/LambdaxA.png'), 
                    sourceActive: require('../../assets/buttons/LambdaxASelected.png'),
                    active: props.matrixState == MatrixState.LambdaxA, 
                    disabled: !props.isMatrixFull,
                });
            case ButtonType.AxB:
                return new ButtonData({
                    source: require('../../assets/buttons/AxB.png'), 
                    sourceActive: require('../../assets/buttons/AxBSelected.png'),
                    active: props.matrixState == MatrixState.AxB, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressAxB,
                });
            case ButtonType.BxA:
                return new ButtonData({
                    source: require('../../assets/buttons/BxA.png'), 
                    sourceActive: require('../../assets/buttons/BxASelected.png'),
                    active: props.matrixState == MatrixState.BxA, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressBxA,
                });
            case ButtonType.Inverse:
                return new ButtonData({
                    source: require('../../assets/buttons/Inverse.png'), 
                    onPress: props.onInvert,
                    disabled: !props.isMatrixFull
                        || !props.isMatrixSquare,
                });
            case ButtonType.Transposed:
                return new ButtonData({
                    source: require('../../assets/buttons/Transposed.png'), 
                    onPress: props.onTranspose,
                    disabled: (
                        ([
                            MatrixState.addMatrix,
                            MatrixState.subtractMatrix,
                            MatrixState.AxB,
                            MatrixState.BxA,
                        ]
                        .includes(props.matrixState))
                        && (!props.isMatrixSquare)
                    )
                });
            case ButtonType.SubtractMatrix:
                return new ButtonData({
                    source: require('../../assets/buttons/SubtractMatrix.png'),
                    sourceActive: require('../../assets/buttons/SubtractMatrixSelected.png'),
                    active: props.matrixState == MatrixState.subtractMatrix, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressSubtractMatrix,
                });
            case ButtonType.AddMatrix:
                return new ButtonData({
                    source: require('../../assets/buttons/AddMatrix.png'), 
                    sourceActive: require('../../assets/buttons/AddMatrixSelected.png'),
                    active: props.matrixState == MatrixState.addMatrix, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressAddMatrix,
                });
            case ButtonType.Subtract:
                return new ButtonData({
                    source: require('../../assets/buttons/Subtract.png'), 
                });
            case ButtonType.Add:
                return new ButtonData({
                    source: require('../../assets/buttons/Add.png'), 
                });
            case ButtonType.Multiply:
                return new ButtonData({
                    source: require('../../assets/buttons/Multiply.png'), 
                });
            case ButtonType.Divide:
                return new ButtonData({
                    source: require('../../assets/buttons/Divide.png'), 
                });
            case ButtonType.Enter:
                return new ButtonData({
                    source: require('../../assets/buttons/Enter.png'), 
                    onPress: props.onEnter,
                });
            case ButtonType.Check:
                return new ButtonData({
                    source: require('../../assets/buttons/Check.png'), 
                    onPress: props.onCheck,
                    disabled: !props.isMatrixFull,
                });
            default:
                return new ButtonData({
                    source: require('../../assets/buttons/Comma.png'), 
                    onPress: () => props.numberButtonPressed(','),
                });
        }
    }

    const buttonData = getButtonData();

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                opacity: buttonData.disabled && 0.5,
                ...buttonData.style,
            }}
            disabled={buttonData.disabled}
            onPress={buttonData.onPress}
        >
        <Image 
            style={{
                flex: 1,
                height: undefined,
                width: undefined,
            }}
            source={
                buttonData.active 
                    ? buttonData.sourceActive 
                    : buttonData.source
            } 
            resizeMode='contain'
        />
        </TouchableOpacity>
    );
}
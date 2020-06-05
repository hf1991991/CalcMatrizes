import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ButtonType, MatrixState, Operator } from '../utilities/constants';
import ButtonData from '../utilities/ButtonData';

export default function CalculatorButton(props) {

    function getButtonData() {
        switch (props.buttonType) {
            case ButtonType[0]:
                return new ButtonData({
                    source: require('../../assets/buttons/0.png'), 
                    style: {flex: 2},
                    onPress: () => props.numberButtonPressed(0),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[1]:
                return new ButtonData({
                    source: require('../../assets/buttons/1.png'), 
                    onPress: () => props.numberButtonPressed(1),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[2]:
                return new ButtonData({
                    source: require('../../assets/buttons/2.png'), 
                    onPress: () => props.numberButtonPressed(2),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[3]:
                return new ButtonData({
                    source: require('../../assets/buttons/3.png'), 
                    onPress: () => props.numberButtonPressed(3),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[4]:
                return new ButtonData({
                    source: require('../../assets/buttons/4.png'), 
                    onPress: () => props.numberButtonPressed(4),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[5]:
                return new ButtonData({
                    source: require('../../assets/buttons/5.png'), 
                    onPress: () => props.numberButtonPressed(5),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[6]:
                return new ButtonData({
                    source: require('../../assets/buttons/6.png'), 
                    onPress: () => props.numberButtonPressed(6),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[7]:
                return new ButtonData({
                    source: require('../../assets/buttons/7.png'), 
                    onPress: () => props.numberButtonPressed(7),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[8]:
                return new ButtonData({
                    source: require('../../assets/buttons/8.png'), 
                    onPress: () => props.numberButtonPressed(8),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType[9]:
                return new ButtonData({
                    source: require('../../assets/buttons/9.png'), 
                    onPress: () => props.numberButtonPressed(9),
                    disabled: !props.isKeyboardBeActive,
                });
            case ButtonType.Comma:
                return new ButtonData({
                    source: require('../../assets/buttons/Comma.png'), 
                    onPress: () => props.numberButtonPressed('.'),
                    disabled: !props.isKeyboardBeActive,
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
            case ButtonType.Operators:
                return new ButtonData({
                    source: require('../../assets/buttons/InactiveOperators.png'), 
                    sourceActive: require('../../assets/buttons/ActiveOperators.png'), 
                    active: props.operatorsActive,
                    onPress: props.changeOperatorsButtonActive,
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
                    active: props.isRActive,
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressR,
                });
            case ButtonType.AxXeB:
                return new ButtonData({
                    source: require('../../assets/buttons/AxXeB.png'),
                    sourceActive: require('../../assets/buttons/AxXeBActive.png'),
                    active: props.matrixState === MatrixState.AxXeB,
                    disabled: !props.isMatrixFull,
                    onPress: () => props.onPressResolveEquation(MatrixState.AxXeB),
                });
            case ButtonType.BxXeA:
                return new ButtonData({
                    source: require('../../assets/buttons/BxXeA.png'),
                    sourceActive: require('../../assets/buttons/BxXeAActive.png'),
                    active: props.matrixState === MatrixState.BxXeA,
                    disabled: !props.isMatrixFull,
                    onPress: () => props.onPressResolveEquation(MatrixState.BxXeA),
                });
            case ButtonType.XxAeB:
                return new ButtonData({
                    source: require('../../assets/buttons/XxAeB.png'),
                    sourceActive: require('../../assets/buttons/XxAeBActive.png'),
                    active: props.matrixState === MatrixState.XxAeB,
                    disabled: !props.isMatrixFull,
                    onPress: () => props.onPressResolveEquation(MatrixState.XxAeB),
                });
            case ButtonType.XxBeA:
                return new ButtonData({
                    source: require('../../assets/buttons/XxBeA.png'),
                    sourceActive: require('../../assets/buttons/XxBeAActive.png'),
                    active: props.matrixState === MatrixState.XxBeA,
                    disabled: !props.isMatrixFull,
                    onPress: () => props.onPressResolveEquation(MatrixState.XxBeA),
                });
            case ButtonType.LambdaxA:
                return new ButtonData({
                    source: require('../../assets/buttons/LambdaxA.png'), 
                    sourceActive: require('../../assets/buttons/LambdaxASelected.png'),
                    active: props.matrixState === MatrixState.LambdaxA, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressLambdaxA,
                });
            case ButtonType.AxB:
                return new ButtonData({
                    source: require('../../assets/buttons/AxB.png'), 
                    sourceActive: require('../../assets/buttons/AxBSelected.png'),
                    active: props.matrixState === MatrixState.AxB, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressAxB,
                });
            case ButtonType.BxA:
                return new ButtonData({
                    source: require('../../assets/buttons/BxA.png'), 
                    sourceActive: require('../../assets/buttons/BxASelected.png'),
                    active: props.matrixState === MatrixState.BxA, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressBxA,
                });
            case ButtonType.Inverse:
                return new ButtonData({
                    source: require('../../assets/buttons/Inverse.png'), 
                    onPress: props.onInvert,
                    disabled: !props.isInverseEnabled,
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
                    active: props.matrixState === MatrixState.subtractMatrix, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressSubtractMatrix,
                });
            case ButtonType.AddMatrix:
                return new ButtonData({
                    source: require('../../assets/buttons/AddMatrix.png'), 
                    sourceActive: require('../../assets/buttons/AddMatrixSelected.png'),
                    active: props.matrixState === MatrixState.addMatrix, 
                    disabled: !props.isMatrixFull,
                    onPress: props.onPressAddMatrix,
                });
            case ButtonType.Subtract:
                return new ButtonData({
                    source: require('../../assets/buttons/Subtract.png'), 
                    sourceActive: require('../../assets/buttons/ActiveSubtract.png'), 
                    disabled: !props.isKeyboardBeActive,
                    active: props.selectedOperator === Operator.Subtract 
                        && props.editableOperatorNumber === null,
                    onPress: () => props.onPressOperator(Operator.Subtract),
                });
            case ButtonType.Add:
                return new ButtonData({
                    source: require('../../assets/buttons/Add.png'), 
                    sourceActive: require('../../assets/buttons/ActiveAdd.png'), 
                    disabled: !props.isKeyboardBeActive,
                    active: props.selectedOperator === Operator.Add 
                        && props.editableOperatorNumber === null,
                    onPress: () => props.onPressOperator(Operator.Add),
                });
            case ButtonType.Multiply:
                return new ButtonData({
                    source: require('../../assets/buttons/Multiply.png'), 
                    sourceActive: require('../../assets/buttons/ActiveMultiply.png'), 
                    disabled: !props.isKeyboardBeActive,
                    active: props.selectedOperator === Operator.Multiply 
                        && props.editableOperatorNumber === null,
                    onPress: () => props.onPressOperator(Operator.Multiply),
                });
            case ButtonType.Divide:
                return new ButtonData({
                    source: require('../../assets/buttons/Divide.png'), 
                    sourceActive: require('../../assets/buttons/ActiveDivide.png'), 
                    disabled: !props.isKeyboardBeActive,
                    active: props.selectedOperator === Operator.Divide 
                        && props.editableOperatorNumber === null,
                    onPress: () => props.onPressOperator(Operator.Divide),
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
                    disabled: !props.isCheckActive || props.matrixState === MatrixState.ready,
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
                opacity: buttonData.disabled && 0.6,
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
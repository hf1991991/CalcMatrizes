import React, { useMemo } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ButtonType, CalcState, Operator } from '../utilities/constants';
import ButtonData from '../utilities/ButtonData';

import { useCalculator } from '../hooks/useCalculator';

export default function CalculatorButton({ buttonType }) {
    const useCalculatorData = useCalculator();

    const buttonData = useMemo(
        () => {
            const { 
                calcState,
                fullScreenDeterminant: fullKeyboardDisabled,
                isNumberKeyboardActive,
                isVariableKeyboardActive,
                onPressNumberButton,
                changeColumnDirectionActive,
                changeSecondSetOfKeysActive,
                isMatrixSquare,
                isMatrixFull,
                isInverseEnabled,
                isCheckActive,
                changeIsVariableKeyboardActive,
                secondSetOfKeysActive,
                columnDirectionActive,
                selectedOperator,
                editableOperatorNumber,
                isRActive,
                onPressAC,
                onPressCE,
                onPressLambdaxA,
                onPressR,
                onPressAxB,
                onPressBxA,
                onInvert,
                onTranspose,
                onPressResolveEquation,
                onPressAddMatrix,
                onPressSubtractMatrix,
                onPressOperator,
                onEnter,
                onCheck,
            } = useCalculatorData;

            function getData() {
                switch (buttonType) {
                    case ButtonType[0]:
                        return new ButtonData({
                            source: require('../../assets/buttons/0.png'), 
                            style: {flex: 2},
                            onPress: () => onPressNumberButton(0),
                            disabled: !isNumberKeyboardActive || isVariableKeyboardActive,
                        });
                    case ButtonType[1]:
                        return new ButtonData({
                            source: require('../../assets/buttons/1.png'), 
                            onPress: () => onPressNumberButton(1),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType[2]:
                        return new ButtonData({
                            source: require('../../assets/buttons/2.png'), 
                            onPress: () => onPressNumberButton(2),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType[3]:
                        return new ButtonData({
                            source: require('../../assets/buttons/3.png'), 
                            onPress: () => onPressNumberButton(3),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType[4]:
                        return new ButtonData({
                            source: require('../../assets/buttons/4.png'), 
                            onPress: () => onPressNumberButton(4),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType[5]:
                        return new ButtonData({
                            source: require('../../assets/buttons/5.png'), 
                            onPress: () => onPressNumberButton(5),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType[6]:
                        return new ButtonData({
                            source: require('../../assets/buttons/6.png'), 
                            onPress: () => onPressNumberButton(6),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType[7]:
                        return new ButtonData({
                            source: require('../../assets/buttons/7.png'), 
                            onPress: () => onPressNumberButton(7),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType[8]:
                        return new ButtonData({
                            source: require('../../assets/buttons/8.png'), 
                            onPress: () => onPressNumberButton(8),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType[9]:
                        return new ButtonData({
                            source: require('../../assets/buttons/9.png'), 
                            onPress: () => onPressNumberButton(9),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.Comma:
                        return new ButtonData({
                            source: require('../../assets/buttons/Comma.png'), 
                            onPress: () => onPressNumberButton('.'),
                            disabled: !isNumberKeyboardActive || isVariableKeyboardActive,
                        });
                    case ButtonType.a:
                        return new ButtonData({
                            source: require('../../assets/buttons/a.png'), 
                            onPress: () => onPressNumberButton('a'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.b:
                        return new ButtonData({
                            source: require('../../assets/buttons/b.png'), 
                            onPress: () => onPressNumberButton('b'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.c:
                        return new ButtonData({
                            source: require('../../assets/buttons/c.png'), 
                            onPress: () => onPressNumberButton('c'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.d:
                        return new ButtonData({
                            source: require('../../assets/buttons/d.png'), 
                            onPress: () => onPressNumberButton('d'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.e:
                        return new ButtonData({
                            source: require('../../assets/buttons/e.png'), 
                            onPress: () => onPressNumberButton('e'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.f:
                        return new ButtonData({
                            source: require('../../assets/buttons/f.png'), 
                            onPress: () => onPressNumberButton('f'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.g:
                        return new ButtonData({
                            source: require('../../assets/buttons/g.png'), 
                            onPress: () => onPressNumberButton('g'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.h:
                        return new ButtonData({
                            source: require('../../assets/buttons/h.png'), 
                            onPress: () => onPressNumberButton('h'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.i:
                        return new ButtonData({
                            source: require('../../assets/buttons/i.png'), 
                            onPress: () => onPressNumberButton('i'),
                            disabled: !isNumberKeyboardActive,
                        });
                    case ButtonType.AC:
                        return new ButtonData({
                            source: require('../../assets/buttons/AC.png'), 
                            onPress: onPressAC,
                        });
                    case ButtonType.CE:
                        return new ButtonData({
                            source: require('../../assets/buttons/CE.png'), 
                            onPress: onPressCE,
                        });
                    case ButtonType.abc:
                        return new ButtonData({
                            source: require('../../assets/buttons/abc.png'), 
                            sourceActive: require('../../assets/buttons/abcSelected.png'), 
                            active: isVariableKeyboardActive,
                            onPress: () => changeIsVariableKeyboardActive(!isVariableKeyboardActive),
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
                            active: secondSetOfKeysActive,
                            disabled: isNumberKeyboardActive || isRActive,
                            onPress: changeSecondSetOfKeysActive,
                        });
                    case ButtonType.ColumnDirection:
                        return new ButtonData({
                            source: require('../../assets/buttons/InactiveColumnDirection.png'),
                            sourceActive: require('../../assets/buttons/ActiveColumnDirection.png'),
                            active: columnDirectionActive,
                            onPress: changeColumnDirectionActive,
                        });
                    case ButtonType.R:
                        return new ButtonData({
                            source: require('../../assets/buttons/R.png'),
                            sourceActive: require('../../assets/buttons/RSelected.png'),
                            active: isRActive,
                            disabled: !isMatrixFull || isNumberKeyboardActive,
                            onPress: onPressR,
                        });
                    case ButtonType.AxXeB:
                        return new ButtonData({
                            source: require('../../assets/buttons/AxXeB.png'),
                            sourceActive: require('../../assets/buttons/AxXeBActive.png'),
                            active: calcState === CalcState.AxXeB,
                            disabled: !isMatrixFull,
                            onPress: () => onPressResolveEquation(CalcState.AxXeB),
                        });
                    case ButtonType.BxXeA:
                        return new ButtonData({
                            source: require('../../assets/buttons/BxXeA.png'),
                            sourceActive: require('../../assets/buttons/BxXeAActive.png'),
                            active: calcState === CalcState.BxXeA,
                            disabled: !isMatrixFull,
                            onPress: () => onPressResolveEquation(CalcState.BxXeA),
                        });
                    case ButtonType.XxAeB:
                        return new ButtonData({
                            source: require('../../assets/buttons/XxAeB.png'),
                            sourceActive: require('../../assets/buttons/XxAeBActive.png'),
                            active: calcState === CalcState.XxAeB,
                            disabled: !isMatrixFull,
                            onPress: () => onPressResolveEquation(CalcState.XxAeB),
                        });
                    case ButtonType.XxBeA:
                        return new ButtonData({
                            source: require('../../assets/buttons/XxBeA.png'),
                            sourceActive: require('../../assets/buttons/XxBeAActive.png'),
                            active: calcState === CalcState.XxBeA,
                            disabled: !isMatrixFull,
                            onPress: () => onPressResolveEquation(CalcState.XxBeA),
                        });
                    case ButtonType.LambdaxA:
                        return new ButtonData({
                            source: require('../../assets/buttons/LambdaxA.png'), 
                            sourceActive: require('../../assets/buttons/LambdaxASelected.png'),
                            active: calcState === CalcState.LambdaxA, 
                            disabled: !isMatrixFull,
                            onPress: onPressLambdaxA,
                        });
                    case ButtonType.AxB:
                        return new ButtonData({
                            source: require('../../assets/buttons/AxB.png'), 
                            sourceActive: require('../../assets/buttons/AxBSelected.png'),
                            active: calcState === CalcState.AxB, 
                            disabled: !isMatrixFull,
                            onPress: onPressAxB,
                        });
                    case ButtonType.BxA:
                        return new ButtonData({
                            source: require('../../assets/buttons/BxA.png'), 
                            sourceActive: require('../../assets/buttons/BxASelected.png'),
                            active: calcState === CalcState.BxA, 
                            disabled: !isMatrixFull,
                            onPress: onPressBxA,
                        });
                    case ButtonType.Inverse:
                        return new ButtonData({
                            source: require('../../assets/buttons/Inverse.png'), 
                            onPress: onInvert,
                            disabled: !isInverseEnabled,
                        });
                    case ButtonType.Transposed:
                        return new ButtonData({
                            source: require('../../assets/buttons/Transposed.png'), 
                            onPress: onTranspose,
                            disabled: (
                                ([
                                    CalcState.addMatrix,
                                    CalcState.subtractMatrix,
                                    CalcState.AxB,
                                    CalcState.BxA,
                                ]
                                .includes(calcState))
                                && !isMatrixSquare
                            )
                        });
                    case ButtonType.SubtractMatrix:
                        return new ButtonData({
                            source: require('../../assets/buttons/SubtractMatrix.png'),
                            sourceActive: require('../../assets/buttons/SubtractMatrixSelected.png'),
                            active: calcState === CalcState.subtractMatrix, 
                            disabled: !isMatrixFull,
                            onPress: onPressSubtractMatrix,
                        });
                    case ButtonType.AddMatrix:
                        return new ButtonData({
                            source: require('../../assets/buttons/AddMatrix.png'), 
                            sourceActive: require('../../assets/buttons/AddMatrixSelected.png'),
                            active: calcState === CalcState.addMatrix, 
                            disabled: !isMatrixFull,
                            onPress: onPressAddMatrix,
                        });
                    case ButtonType.Subtract:
                        return new ButtonData({
                            source: require('../../assets/buttons/Subtract.png'), 
                            sourceActive: require('../../assets/buttons/ActiveSubtract.png'), 
                            disabled: !isNumberKeyboardActive,
                            active: selectedOperator === Operator.Subtract 
                                && editableOperatorNumber === null,
                            onPress: () => onPressOperator(Operator.Subtract),
                        });
                    case ButtonType.Add:
                        return new ButtonData({
                            source: require('../../assets/buttons/Add.png'), 
                            sourceActive: require('../../assets/buttons/ActiveAdd.png'), 
                            disabled: !isNumberKeyboardActive,
                            active: selectedOperator === Operator.Add 
                                && editableOperatorNumber === null,
                            onPress: () => onPressOperator(Operator.Add),
                        });
                    case ButtonType.Multiply:
                        return new ButtonData({
                            source: require('../../assets/buttons/Multiply.png'), 
                            sourceActive: require('../../assets/buttons/ActiveMultiply.png'), 
                            disabled: !isNumberKeyboardActive,
                            active: selectedOperator === Operator.Multiply 
                                && editableOperatorNumber === null,
                            onPress: () => onPressOperator(Operator.Multiply),
                        });
                    case ButtonType.Divide:
                        return new ButtonData({
                            source: require('../../assets/buttons/Divide.png'), 
                            sourceActive: require('../../assets/buttons/ActiveDivide.png'), 
                            disabled: !isNumberKeyboardActive,
                            active: selectedOperator === Operator.Divide 
                                && editableOperatorNumber === null,
                            onPress: () => onPressOperator(Operator.Divide),
                        });
                    case ButtonType.Enter:
                        return new ButtonData({
                            source: require('../../assets/buttons/Enter.png'), 
                            onPress: onEnter,
                        });
                    case ButtonType.Check:
                        return new ButtonData({
                            source: require('../../assets/buttons/Check.png'), 
                            onPress: onCheck,
                            disabled: !isCheckActive || calcState === CalcState.ready,
                        });
                    default:
                        return new ButtonData({
                            source: require('../../assets/buttons/Comma.png'), 
                            onPress: () => onPressNumberButton(','),
                        });
                }
            }

            const data = getData();
    
            return {
                ...data,
                disabled: data.disabled || fullKeyboardDisabled
            }
        }, [useCalculatorData, buttonType]
    );

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
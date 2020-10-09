import React, { useCallback, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import Matrix from './Matrix';
import { CalcState, findFraction, toFixedOnZeroes, SystemSolutionType } from '../utilities/constants';
import ArrowButtonsArea from './ArrowButtonsArea';
import MatrixOperations from '../utilities/MatrixOperations';
import FullEquation from './FullEquation';
import ScalarOperations from '../utilities/ScalarOperations';

import { useCalculator } from '../hooks/useCalculator';
import { useOrientation } from '../hooks/useOrientation';

const BUTTON_AREAS_CROSS_WIDTH = 70;

export default function MatrixArea() {
    const { isPortrait } = useOrientation();

    const { 
        calcState,
        matrixOnScreen,
        selectedMatrixElement,
        editableDimensions,
        editableScalar,
        changeViewReduced,
        changeFullScreenDeterminant,
        operationHappening,
        editableOperatorNumber,
        changeEditableDimensions,
        solutionType,
        fullEquation,
        viewReduced,
        fullScreenDeterminant
    } = useCalculator();
 
    const [matrixAreaWidth, changeMatrixAreaWidth] = useState(0);
 
    const formatNumberToFraction = useCallback(
        (number) => {
            return number !== null 
                ? findFraction(toFixedOnZeroes(number))
                : null;
        }, []
    );

    const formatDeterminant = useCallback(
        ({ determinant, overflow=true, det=true }) => {
            if (determinant === null) return null
            let stringDeterminant = determinant?.commaStringify();
            if (stringDeterminant.length > 8 && overflow) stringDeterminant = stringDeterminant.substring(0, 8 - 3) + '...';
            if (stringDeterminant && !ScalarOperations.isNumber(stringDeterminant)) 
                return det
                    ? `det: ${stringDeterminant}`
                    : stringDeterminant;
            
            const formatted = formatNumberToFraction(stringDeterminant);
            return formatted !== null 
                ? det
                    ? `det: ${formatted}`
                    : formatted
                : null;
        }, [formatNumberToFraction]
    );

    const scalarText = useMemo(
        () => {
            const scalar = editableOperatorNumber === null
                ? editableScalar
                : editableOperatorNumber;
            if (scalar === null) return null;
            return scalar?.commaStringify({ dontFindFraction: true });
        }, [editableOperatorNumber, editableScalar]
    );

    const equationTypeString = useMemo(
        () => {
            switch (fullEquation?.equationType) {
                case CalcState.AxXeB:
                    return "A×X=B";
                case CalcState.BxXeA:
                    return "B×X=A";
                case CalcState.XxAeB:
                    return "X×A=B";
                case CalcState.XxBeA:
                    return "X×B=A";
                default:
                    return null;
            }
        }, [fullEquation]
    );

    const bottomLeftText = useMemo(
        () => calcState !== CalcState.LambdaxA
            ? fullEquation !== null && !isPortrait
                ? equationTypeString
                : editableDimensions && !fullScreenDeterminant
                    ? `${editableDimensions.rows}x${editableDimensions.columns}`
                    : ''
            : 'Scalar',
        [equationTypeString, calcState, fullEquation, editableDimensions, isPortrait]
    )

    return (
        <View
            style={{
                flex: 1,
                marginTop: 20,
            }}
            onLayout={(event) => {
                changeMatrixAreaWidth(event.nativeEvent.layout.width);
            }}
        >
            <View
                style={{
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    flex: 1,
                }}
            >
                <ArrowButtonsArea 
                    vertical
                    hidden
                    editableDimensions={editableDimensions}
                    changeEditableDimensions={changeEditableDimensions}
                    crossWidth={BUTTON_AREAS_CROSS_WIDTH}
                />
                {
                    calcState !== CalcState.LambdaxA
                        ? fullEquation !== null && !isPortrait
                            ? (
                                <FullEquation 
                                    fullEquation={fullEquation}
                                    totalMaxAreaWidth={matrixAreaWidth - 2 * BUTTON_AREAS_CROSS_WIDTH}
                                    viewReduced={viewReduced}
                                />
                            )
                            : fullScreenDeterminant
                                ? (
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 60,
                                                textAlign: 'center'
                                            }}
                                        >
                                            {
                                                formatDeterminant({
                                                    determinant: MatrixOperations.determinant(matrixOnScreen),
                                                    overflow: false,
                                                    det: false
                                                })
                                            }
                                        </Text>
                                    </View>
                                )
                                : (
                                    <Matrix 
                                        maxMatrixWidth={matrixAreaWidth - 2 * BUTTON_AREAS_CROSS_WIDTH}
                                        matrixNumbers={matrixOnScreen}
                                        selectedMatrixElement={selectedMatrixElement}
                                        editableOperatorNumber={editableOperatorNumber}
                                    />
                                )
                        : (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 60,
                                        textAlign: 'right'
                                    }}
                                >
                                    {scalarText}
                                </Text>
                            </View>
                        )
                }
                <ArrowButtonsArea 
                    vertical
                    hidden={calcState === CalcState.ready || !editableDimensions}
                    disabled={
                        [
                            CalcState.addMatrix,
                            CalcState.subtractMatrix,
                            CalcState.BxA,
                            CalcState.XxAeB,
                            CalcState.XxBeA,
                        ]
                        .includes(calcState)
                        || fullScreenDeterminant
                    }
                    editableDimensions={editableDimensions}
                    changeEditableDimensions={changeEditableDimensions}
                    crossWidth={BUTTON_AREAS_CROSS_WIDTH}
                />
            </View>
            <ArrowButtonsArea 
                hidden={calcState === CalcState.ready || !editableDimensions}
                disabled={
                    [
                        CalcState.addMatrix,
                        CalcState.subtractMatrix,
                        CalcState.AxB,
                        CalcState.AxXeB,
                        CalcState.BxXeA,
                    ]
                    .includes(calcState)
                    || fullScreenDeterminant
                }
                editableDimensions={editableDimensions}
                changeEditableDimensions={changeEditableDimensions}
                bottomLeftText={bottomLeftText}
                bottomRightText={
                    fullEquation !== null && !isPortrait
                        ? [
                            CalcState.AxXeB,
                            CalcState.BxXeA,
                            CalcState.XxAeB,
                            CalcState.XxBeA,
                        ].includes(fullEquation.equationType) 
                            && fullEquation.solutionType !== SystemSolutionType.SPD
                                ? viewReduced ? 'Reduzida' : 'Original'
                                : null
                        : !operationHappening
                            && formatDeterminant({
                                determinant: MatrixOperations.determinant(matrixOnScreen)
                            })
                }
                bottomMiddleText={
                    calcState === CalcState.ready && solutionType
                }
                onPressBottomRightText={
                    !isPortrait
                        ? fullEquation !== null 
                            ? changeViewReduced
                            : () => {}
                        : !operationHappening
                            && changeFullScreenDeterminant
                }
                crossWidth={BUTTON_AREAS_CROSS_WIDTH}
            />
        </View>
    );
}
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Matrix from './Matrix';
import { MatrixState, findFraction, toFixedOnZeroes, SystemSolutionType } from '../utilities/constants';
import ArrowButtonsArea from './ArrowButtonsArea';
import MatrixOperations from '../utilities/MatrixOperations';
import FullEquation from './FullEquation';
import ScalarOperations from '../utilities/ScalarOperations';

const BUTTON_AREAS_CROSS_WIDTH = 70;

export default function MatrixArea({ 
    matrixState,
    readyMatrix,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    editableDimensions,
    changeEditableDimensions,
    editableScalar,
    operationHappening,
    editableOperatorNumber,
    solutionType,
    fullEquation,
    viewReduced,
    changeViewReduced,
    isPortrait,
    fullScreenDeterminant,
    changeFullScreenDeterminant
}) {
 
    let [matrixAreaWidth, changeMatrixAreaWidth] = useState(0);
 
    function formatNumberToFraction(number) {
        return number !== null 
            ? findFraction(toFixedOnZeroes(number))
            : null;
    } 

    function formatDeterminant({ determinant, overflow=true, det=true }) {
        if (determinant === null) return null
        stringDeterminant = determinant.commaStringify();
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
    }

    function formatScalar(scalar) {
        return scalar.commaStringify({ dontFindFraction: true });
    }

    function getEquationTypeString(equationType) {
        switch (equationType) {
            case MatrixState.AxXeB:
                return "A×X=B";
            case MatrixState.BxXeA:
                return "B×X=A";
            case MatrixState.XxAeB:
                return "X×A=B";
            case MatrixState.XxBeA:
                return "X×B=A";
        }
    }

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
                    matrixState !== MatrixState.LambdaxA
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
                                                    determinant: MatrixOperations.determinant(readyMatrix),
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
                                        matrixNumbers={readyMatrix}
                                        selectedMatrixElement={selectedMatrixElement}
                                        changeSelectedMatrixElement={changeSelectedMatrixElement}
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
                                    {formatScalar(
                                        editableOperatorNumber === null
                                            ? editableScalar
                                            : editableOperatorNumber
                                    )}
                                </Text>
                            </View>
                        )
                }
                <ArrowButtonsArea 
                    vertical
                    hidden={matrixState === MatrixState.ready || !editableDimensions}
                    disabled={
                        [
                            MatrixState.addMatrix,
                            MatrixState.subtractMatrix,
                            MatrixState.BxA,
                            MatrixState.XxAeB,
                            MatrixState.XxBeA,
                        ]
                        .includes(matrixState)
                        || fullScreenDeterminant
                    }
                    editableDimensions={editableDimensions}
                    changeEditableDimensions={changeEditableDimensions}
                    crossWidth={BUTTON_AREAS_CROSS_WIDTH}
                />
            </View>
            <ArrowButtonsArea 
                hidden={matrixState === MatrixState.ready || !editableDimensions}
                disabled={
                    [
                        MatrixState.addMatrix,
                        MatrixState.subtractMatrix,
                        MatrixState.AxB,
                        MatrixState.AxXeB,
                        MatrixState.BxXeA,
                    ]
                    .includes(matrixState)
                    || fullScreenDeterminant
                }
                editableDimensions={editableDimensions}
                changeEditableDimensions={changeEditableDimensions}
                bottomLeftText={
                    matrixState !== MatrixState.LambdaxA
                        ? fullEquation !== null && !isPortrait
                            ? getEquationTypeString(fullEquation.equationType)
                            : editableDimensions && !fullScreenDeterminant
                                ? `${editableDimensions.rows}x${editableDimensions.columns}`
                                : ''
                        : 'Scalar'
                }
                bottomRightText={
                    fullEquation !== null && !isPortrait
                        ? [
                            MatrixState.AxXeB,
                            MatrixState.BxXeA,
                            MatrixState.XxAeB,
                            MatrixState.XxBeA,
                        ].includes(fullEquation.equationType) 
                            && fullEquation.solutionType !== SystemSolutionType.SPD
                                ? viewReduced ? 'Reduzida' : 'Original'
                                : null
                        : !operationHappening
                            && formatDeterminant({
                                determinant: MatrixOperations.determinant(readyMatrix)
                            })
                }
                bottomMiddleText={
                    matrixState === MatrixState.ready && solutionType
                }
                onPressBottomRightText={
                    !isPortrait
                        ? fullEquation !== null 
                            ? (() => changeViewReduced(!viewReduced))
                            : () => {}
                        : !operationHappening
                            && (() => changeFullScreenDeterminant(!fullScreenDeterminant))
                }
                crossWidth={BUTTON_AREAS_CROSS_WIDTH}
            />
        </View>
    );
}
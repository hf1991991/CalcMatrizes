import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Matrix from './Matrix';
import { MatrixState, findFraction, toFixedOnZeroes } from '../utilities/constants';
import ArrowButtonsArea from './ArrowButtonsArea';
import MatrixOperations from '../utilities/MatrixOperations';

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
}) {

    let [matrixAreaWidth, changeMatrixAreaWidth] = useState(0);

    function formatNumberToFraction(number) {
        return number !== null 
            ? findFraction(toFixedOnZeroes(number))
            : null;
    }

    function formatDeterminant(determinant) {
        const formatted = formatNumberToFraction(determinant);
        return formatted !== null 
            ? `det: ${formatted}`
            : null;
    }

    function formatScalar(scalar) {
        const parsed = MatrixOperations.parseFloatPreservingDot(scalar);
        console.log(parsed);
        console.log(parsed.toString().endsWith('.'));
        return scalar !== null 
            ? toFixedOnZeroes(
                !parsed.toString().endsWith('.') 
                    ? parsed.toFixed(6)
                    : parsed
            ).toString().replace('.', ',')
            : null;
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
                        ? (
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
                }
                editableDimensions={editableDimensions}
                changeEditableDimensions={changeEditableDimensions}
                bottomLeftText={
                    matrixState !== MatrixState.LambdaxA
                        ? editableDimensions
                            ? `${editableDimensions.rows}x${editableDimensions.columns}`
                            : ''
                        : 'Scalar'
                }
                bottomRightText={
                    !operationHappening
                        && formatDeterminant(MatrixOperations.determinant(readyMatrix))
                }
                crossWidth={BUTTON_AREAS_CROSS_WIDTH}
            />
        </View>
    );
}
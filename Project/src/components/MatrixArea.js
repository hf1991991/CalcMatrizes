import React, { useState } from 'react';
import { View } from 'react-native';
import Matrix from './Matrix';
import { MatrixState } from '../utilities/constants';
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
}) {

    let [matrixAreaWidth, changeMatrixAreaWidth] = useState(0);

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
                <Matrix 
                    maxMatrixWidth={matrixAreaWidth - 2 * BUTTON_AREAS_CROSS_WIDTH}
                    matrixNumbers={readyMatrix}
                    selectedMatrixElement={selectedMatrixElement}
                    changeSelectedMatrixElement={changeSelectedMatrixElement}
                />
                <ArrowButtonsArea 
                    vertical
                    hidden={matrixState === MatrixState.ready}
                    disabled={
                        [
                            MatrixState.addMatrix,
                            MatrixState.subtractMatrix,
                            MatrixState.BxA,
                        ]
                        .includes(matrixState)
                    }
                    editableDimensions={editableDimensions}
                    changeEditableDimensions={changeEditableDimensions}
                    crossWidth={BUTTON_AREAS_CROSS_WIDTH}
                />
            </View>
            <ArrowButtonsArea 
                hidden={matrixState === MatrixState.ready}
                disabled={
                    [
                        MatrixState.addMatrix,
                        MatrixState.subtractMatrix,
                        MatrixState.AxB,
                    ]
                    .includes(matrixState)
                }
                editableDimensions={editableDimensions}
                changeEditableDimensions={changeEditableDimensions}
                determinant={
                    MatrixOperations.determinant(readyMatrix)
                }
                crossWidth={BUTTON_AREAS_CROSS_WIDTH}
            />
        </View>
    );
}
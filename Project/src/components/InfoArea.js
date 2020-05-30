import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import MatrixArea from './MatrixArea';
import MatrixOperations from '../utilities/MatrixOperations';
import { MatrixState } from '../utilities/constants';

export default function InfoArea({ 
    matrixState,
    readyMatrix,
    changeReadyMatrix,
    onPressBackground,
    editableMatrix,
    changeEditableMatrix,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    editableDimensions,
    changeEditableDimensions,
}) {

    return (
        <TouchableWithoutFeedback
            onPress={onPressBackground}
        >
            <View
                style={{
                    flex: 1,
                }}
            >
                <MatrixArea 
                    matrixState={matrixState}
                    readyMatrix={
                        matrixState === MatrixState.ready
                            ? readyMatrix
                            : editableMatrix
                    }
                    changeReadyMatrix={changeReadyMatrix}
                    editableDimensions={editableDimensions}
                    changeEditableDimensions={({ rows, columns }) => {
                        changeEditableDimensions({ rows, columns });
                        changeEditableMatrix(
                            MatrixOperations.resizeMatrix({
                                originalMatrix: readyMatrix,
                                editableMatrix: editableMatrix,
                                rows,
                                columns,
                            })
                        );
                        console.log(selectedMatrixElement);
                        if (selectedMatrixElement?.row >= rows 
                            || selectedMatrixElement?.column >= columns
                        ) changeSelectedMatrixElement(null);
                    }}
                    selectedMatrixElement={selectedMatrixElement}
                    changeSelectedMatrixElement={changeSelectedMatrixElement}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}
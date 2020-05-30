import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import MatrixArea from './MatrixArea';
import MatrixOperations from '../utilities/MatrixOperations';
import { MatrixState } from '../utilities/constants';

export default function InfoArea({ 
    matrixState,
    currentMatrix,
    changeCurrentMatrix,
    editableMatrix,
    changeEditableMatrix,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    editableDimensions,
    changeEditableDimensions,
}) {

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <MatrixArea 
                matrixState={matrixState}
                currentMatrix={
                    matrixState == MatrixState.editing
                        ? editableMatrix
                        : currentMatrix
                }
                changeCurrentMatrix={changeCurrentMatrix}
                editableDimensions={editableDimensions}
                changeEditableDimensions={({ rows, columns }) => {
                    changeEditableDimensions({ rows, columns });
                    changeEditableMatrix(
                        MatrixOperations.resizeMatrix({
                            originalMatrix: currentMatrix,
                            editableMatrix: editableMatrix,
                            rows,
                            columns,
                        })
                    );
                }}
                selectedMatrixElement={selectedMatrixElement}
                changeSelectedMatrixElement={changeSelectedMatrixElement}
            />
        </View>
    );
}
import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import MatrixArea from './MatrixArea';
import MatrixOperations from '../utilities/MatrixOperations';
import { MatrixState } from '../utilities/constants';

export default function InfoArea(props) {

    return (
        <TouchableWithoutFeedback
            onPress={props.onPressBackground}
        >
            <View
                style={{
                    flex: 1,
                }}
            >
                <MatrixArea 
                    {...props}
                    readyMatrix={
                        props.matrixState === MatrixState.ready
                            ? props.readyMatrix
                            : props.editableMatrix
                    }
                    changeEditableDimensions={({ rows, columns }) => {
                        props.changeEditableDimensions({ rows, columns });
                        props.changeEditableMatrix(
                            MatrixOperations.resizeMatrix({
                                originalMatrix: props.matrixState === MatrixState.editing
                                    ? props.readyMatrix
                                    : props.editableMatrix,
                                editableMatrix: props.editableMatrix,
                                rows,
                                columns,
                            })
                        );
                        
                        if (props.selectedMatrixElement?.row >= rows 
                            || props.selectedMatrixElement?.column >= columns
                        ) props.changeSelectedMatrixElement(null);
                    }}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}
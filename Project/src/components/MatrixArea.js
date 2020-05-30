import React from 'react';
import { View, SafeAreaView } from 'react-native';
import Matrix from './Matrix';
import ArrowButton from './ArrowButton';
import { MatrixState } from '../utilities/constants';
import ArrowButtonsArea from './ArrowButtonsArea';

export default function MatrixArea({ 
    matrixState,
    currentMatrix,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    editableDimensions,
    changeEditableDimensions,
    changeNumberWritten,
}) {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                marginTop: 20,
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
                />
                <Matrix 
                    matrixNumbers={currentMatrix}
                    selectedMatrixElement={selectedMatrixElement}
                    changeSelectedMatrixElement={changeSelectedMatrixElement}
                    changeNumberWritten={changeNumberWritten}
                />
                <ArrowButtonsArea 
                    vertical
                    hidden={matrixState != MatrixState.editing}
                    editableDimensions={editableDimensions}
                    changeEditableDimensions={changeEditableDimensions}
                />
            </View>
            <ArrowButtonsArea 
                hidden={matrixState != MatrixState.editing}
                editableDimensions={editableDimensions}
                changeEditableDimensions={changeEditableDimensions}
            />
        </SafeAreaView>
    );
}
import React from 'react';
import { View, SafeAreaView } from 'react-native';
import Matrix from './Matrix';
import { MatrixState } from '../utilities/constants';
import ArrowButtonsArea from './ArrowButtonsArea';

export default function MatrixArea({ 
    matrixState,
    readyMatrix,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    editableDimensions,
    changeEditableDimensions,
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
            />
        </SafeAreaView>
    );
}
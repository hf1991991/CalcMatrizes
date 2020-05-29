import React from 'react';
import { View } from 'react-native';
import Matrix from './Matrix';
import ArrowButton from './ArrowButton';
import { MatrixState } from '../utilities/constants';

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
        <View>
            <View
                style={{flexDirection: 'row'}}
            >
                <View
                    style={{flex: 1}}
                >
                    <Matrix 
                        matrixNumbers={currentMatrix}
                        selectedMatrixElement={selectedMatrixElement}
                        changeSelectedMatrixElement={changeSelectedMatrixElement}
                        changeNumberWritten={changeNumberWritten}
                    />
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 15,
                        display: matrixState != MatrixState.editing && 'none',
                    }}
                >
                    <ArrowButton 
                        source={require('../../assets/icons/LeftArrow.png')}
                        onPress={
                            () => changeEditableDimensions({
                                ...editableDimensions,
                                columns: editableDimensions.columns - 1,
                            })
                        }
                        disabled={editableDimensions.columns <= 1}
                    />
                    <ArrowButton 
                        source={require('../../assets/icons/RightArrow.png')}
                        onPress={
                            () => changeEditableDimensions({
                                ...editableDimensions,
                                columns: editableDimensions.columns + 1,
                            })
                        }
                    />
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 15,
                    display: matrixState != MatrixState.editing && 'none',
                }}
            >
                <ArrowButton 
                    vertical
                    onPress={
                        () => changeEditableDimensions({
                            ...editableDimensions,
                            rows: editableDimensions.rows - 1,
                        })
                    }
                    disabled={editableDimensions.rows <= 1}
                    source={require('../../assets/icons/UpArrow.png')}
                />
                <ArrowButton 
                    vertical
                    source={require('../../assets/icons/DownArrow.png')}
                    onPress={
                        () => changeEditableDimensions({
                            ...editableDimensions,
                            rows: editableDimensions.rows + 1,
                        })
                    }
                />
            </View>
        </View>
    );
}
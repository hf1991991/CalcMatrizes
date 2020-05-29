import React from 'react';
import { View } from 'react-native';
import Matrix from './Matrix';
import ArrowButton from './ArrowButton';

export default function MatrixArea({ 
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
                        display: selectedMatrixElement ? 'flex' : 'none',
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
                    display: selectedMatrixElement ? 'flex' : 'none',
                }}
            >
                <ArrowButton 
                    vertical
                    source={require('../../assets/icons/UpArrow.png')}
                    onPress={
                        () => changeEditableDimensions({
                            ...editableDimensions,
                            rows: editableDimensions.rows - 1,
                        })
                    }
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
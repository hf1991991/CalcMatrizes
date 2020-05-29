import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import MatrixArea from './MatrixArea';
import MatrixOperations from '../utilities/MatrixOperations';

export default function InfoArea({ 
    currentMatrix,
    changeCurrentMatrix,
    editableMatrix,
    changeEditableMatrix,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    editableDimensions,
    changeEditableDimensions,
    numberWritten,
    changeNumberWritten,
}) {

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingHorizontal: 30,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <MatrixArea 
                    currentMatrix={
                        selectedMatrixElement
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
                                rows,
                                columns,
                            })
                        );
                    }}
                    selectedMatrixElement={selectedMatrixElement}
                    changeSelectedMatrixElement={changeSelectedMatrixElement}
                    changeNumberWritten={changeNumberWritten}
                />
                <View
                    style={{
                        justifyContent: 'center',
                        minHeight: 100,
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'right',
                            color: '#fff',
                            fontSize: 60,
                            marginVertical: 10,
                        }}
                    >
                        {numberWritten}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
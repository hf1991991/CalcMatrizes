import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import MatrixContainer from './MatrixContainer';

export default function Matrix({ 
    matrixNumbers,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    changeNumberWritten,
}) {
    let [flatListWidth, changeFlatListWidth] = useState(0);

    function getElementStyle(row, column) {
        return {
            backgroundColor: selectedMatrixElement?.row == row && selectedMatrixElement?.column == column
                ? '#3c3c3c'
                : (matrixNumbers?.data[row][column] || '').length == 0
                    ? '#1c1c1c'
                    : 'transparent',
            ...(
                (matrixNumbers?.data[row][column] || '').length == 0
                && {
                    borderColor: '#fff',
                    borderWidth: 1.5,
                    borderStyle: 'dashed',
                }
            )
        };
    }

    let matrixElements = [];

    for (let row = 0; row < matrixNumbers?.dimensions().rows; row++) {
        for (let column = matrixNumbers?.dimensions().columns - 1; column >= 0; column--) {
            matrixElements.push({
                number: matrixNumbers.data[row][column],
                row,
                column,
            });
        }
    }

    return (
        <MatrixContainer 
            matrixColumns={
                <View
                    style={{flex: 1}}
                    onLayout={(event) => {
                        changeFlatListWidth(event.nativeEvent.layout.width);
                    }}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator
                        style={{
                            transform:[{rotateY:'180deg'}],
                        }}
                    >
                        <FlatList
                            key={matrixNumbers.dimensions().columns}
                            scrollEnabled={false}
                            numColumns={matrixNumbers.dimensions().columns}
                            keyExtractor={element => `${element.row}:${element.column}`}
                            data={matrixElements}
                            renderItem={({ item }) => {
                                const { number, row, column } = item;
                                return (
                                    <TouchableOpacity
                                        style={{
                                            alignSelf: 'stretch',
                                            transform:[{rotateY:'180deg'}],
                                        }}
                                        onPress={
                                            () => {
                                                changeSelectedMatrixElement({
                                                    row,
                                                    column,
                                                });
                                                changeNumberWritten(number);
                                            }
                                        }
                                    >
                                        <View
                                            style={{
                                                ...(getElementStyle(row, column)),
                                                marginVertical: 13,
                                                paddingVertical: 5,
                                                paddingHorizontal: 20,
                                                borderRadius: 10,
                                                alignSelf: 'center',
                                                minHeight: 40,
                                                minWidth: Math.max(
                                                    flatListWidth/matrixNumbers?.dimensions().columns-10,
                                                    100
                                                ),
                                                marginHorizontal: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#fff',
                                                    fontSize: 26,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {(number || '').toString().replace('.', ',')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </ScrollView>
                </View>
            }
        />
    );
}
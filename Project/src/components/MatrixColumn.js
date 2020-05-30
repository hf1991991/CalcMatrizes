import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

export default function MatrixColumn({ 
    matrixNumbers,
    matrixColumnElements,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    minWidth,
}) {

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

    return (
        <FlatList
            style={{
                transform:[{rotateX:'180deg'}],
            }}
            scrollEnabled={false}
            contentContainerStyle={{
                justifyContent: 'center',
            }}
            key={matrixNumbers.dimensions().columns}
            keyExtractor={element => `${element.row}:${element.column}`}
            data={matrixColumnElements}
            renderItem={({ item }) => {
                console.log(item);
                const { number, row, column } = item;
                return (
                    <TouchableOpacity
                        style={{
                            alignSelf: 'stretch',
                            transform:[{rotateY:'180deg'},{rotateX:'180deg'}],
                        }}
                        onPress={
                            () => {
                                changeSelectedMatrixElement({
                                    row,
                                    column,
                                });
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
                                minWidth: minWidth,
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
    );
}
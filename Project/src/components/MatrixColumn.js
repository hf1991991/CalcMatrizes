import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

const ELEMENT_HEIGHT = 40;
const ELEMENT_VERTICAL_MARGIN = 11;

export default function MatrixColumn({ 
    matrixNumbers,
    matrixColumnElements,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    minWidth,
    flatListDimensions,
    changeFlatListDimensions,
}) {

    function getElementStyle(row, column) {
        return {
            backgroundColor: selectedMatrixElement?.row == row && selectedMatrixElement?.column == column
                ? '#3c3c3c'
                : (matrixNumbers?.data[row][column] === null)
                    ? '#1c1c1c'
                    : 'transparent',
            ...(
                (matrixNumbers?.data[row][column] === null)
                && {
                    borderColor: '#fff',
                    borderWidth: 1.5,
                    borderStyle: 'dashed',
                }
            )
        };
    }

    function formatElement(element) {
        const decimal = element === null || element === undefined
            ? ''
            : element;
            //: (element.toString().split('.')[1] && element.toString().split('.')[1].length) > 6 ? element.toFixed(6) : element;
        return (decimal === null ? '' : decimal).toString().replace('.', ',');
    }

    return (
        <FlatList
            style={{
                transform:[{rotateX:'180deg'}],
            }}
            scrollEnabled={false}
            key={JSON.stringify(matrixNumbers.dimensions())}
            onLayout={() => {
                changeFlatListDimensions({
                    ...flatListDimensions,
                    height: (ELEMENT_HEIGHT + 2 * ELEMENT_VERTICAL_MARGIN) * matrixNumbers.dimensions().rows,
                });
            }}
            keyExtractor={element => `${element.row}:${element.column}`}
            data={matrixColumnElements}
            renderItem={({ item }) => {
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
                                marginVertical: ELEMENT_VERTICAL_MARGIN,
                                paddingVertical: 5,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: ELEMENT_HEIGHT,
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
                                {formatElement(number)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
}
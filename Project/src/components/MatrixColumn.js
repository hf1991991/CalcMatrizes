import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { findFraction, smartToFixed, toFixedOnZeroes, toFixedWithThreeDots } from '../utilities/constants';

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
    editableOperatorNumber,
    secondaryEditableOperatorNumber,
}) {

    function isElementSelected({ row, column }) {
        return selectedMatrixElement && selectedMatrixElement.row === row && selectedMatrixElement.column === column;
    }

    function getElementStyle(row, column) {
        return {
            backgroundColor: isElementSelected({ row, column })
                ? '#404040'
                : (matrixNumbers?.data[row][column] === null)
                    ? '#1c1c1c'
                    : 'transparent',
            ...(
                (matrixNumbers?.data[row][column] === null)
                && {
                    //borderColor: '#fff',
                    //borderWidth: 1.5,
                    //borderStyle: 'dashed',
                }
            )
        };
    }

    function formatElement({ number, row, column }) {
        let numberToFormat = isElementSelected({ row, column })
            && editableOperatorNumber 
                ? editableOperatorNumber 
                : number;

        if (numberToFormat === null 
            || numberToFormat === undefined 
            || numberToFormat.toString().length === 0
        ) return '';

        const possibleFraction = numberToFormat.toString().endsWith('.')
            ? numberToFormat
            : isElementSelected({ row, column })
                ? toFixedWithThreeDots(numberToFormat)
                : findFraction(numberToFormat);
        
        return possibleFraction.toString().replace('.', ',');
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
                                {formatElement(item)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
}
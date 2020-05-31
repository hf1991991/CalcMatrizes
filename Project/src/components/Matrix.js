import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import MatrixContainer from './MatrixContainer';
import MatrixColumn from './MatrixColumn';
import MatrixOperations from '../utilities/MatrixOperations';

export default function Matrix({ 
    matrixNumbers,
    selectedMatrixElement,
    changeSelectedMatrixElement,
    maxMatrixWidth,
}) {
    let [flatListDimensions, changeFlatListDimensions] = useState({
        height: 0,
        width: 0,
    });

    return (
        <MatrixContainer 
            maxWidth={maxMatrixWidth}
            matrixContent={
                <View
                    onLayout={(event) => {
                        changeFlatListDimensions({
                            height: event.nativeEvent.layout.height,
                            width: event.nativeEvent.layout.width,
                        });
                    }}
                >
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator
                        directionalLockEnabled={false}
                        style={{
                            transform:[{rotateY:'180deg'}],
                        }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentInset={{
                            top: 1,
                            bottom: 1,
                            right: 1,
                            left: 1,
                        }}
                        data={MatrixOperations.insertElementsPosition(matrixNumbers)}
                        keyExtractor={element => element.column.toString()}
                        renderItem={({ item }) => {
                            return (
                                <MatrixColumn
                                    matrixNumbers={matrixNumbers}
                                    matrixColumnElements={item.data}
                                    selectedMatrixElement={selectedMatrixElement}
                                    changeSelectedMatrixElement={changeSelectedMatrixElement}
                                    minWidth={Math.min(
                                        flatListDimensions.width/matrixNumbers?.dimensions().columns-10,
                                        50
                                    )}
                                />
                            );
                        }}
                    />
                </View>
            }
        />
    );
}
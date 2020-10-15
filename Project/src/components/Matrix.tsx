import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import MatrixContainer from './MatrixContainer';
import MatrixColumn from './MatrixColumn';
import MatrixOperations from '../utilities/MatrixOperations';

const Matrix: React.FC = ({ 
    matrixNumbers,
    selectedMatrixElement=null,
    maxMatrixWidth,
    editableOperatorNumber=null,
    onLayout,
    changeSelectedMatrixElement
}) => {
    const [flatListDimensions, changeFlatListDimensions] = useState({
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
                            ...flatListDimensions,
                            width: event.nativeEvent.layout.width,
                        });
                        onLayout && onLayout(event);
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
                        contentContainerStyle={{
                            height: flatListDimensions.height,
                        }}
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
                                    minWidth={50}
                                    flatListDimensions={flatListDimensions}
                                    changeFlatListDimensions={changeFlatListDimensions}
                                    editableOperatorNumber={editableOperatorNumber}
                                    changeSelectedMatrixElement={changeSelectedMatrixElement}
                                />
                            );
                        }}
                    />
                </View>
            }
        />
    );
}

export default Matrix;
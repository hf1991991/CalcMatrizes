import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import ButtonsArea from './components/ButtonsArea';
import InfoArea from './components/InfoArea';
import { MatrixState, count } from './utilities/constants';
import MatrixOperations from './utilities/MatrixOperations';
import MatrixData from './utilities/MatrixData';

const NULL_MATRIX = () => new MatrixData({
    data: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ],
});

export default function App() {
    let [currentMatrix, changeCurrentMatrix] = useState(NULL_MATRIX());
    let [editableMatrix, changeEditableMatrix] = useState(null);
    let [numberWritten, changeNumberWritten] = useState(null);
    let [selectedMatrixElement, changeSelectedMatrixElement] = useState(null);
    let [editableDimensions, changeEditableDimensions] = useState(null);
    let [matrixState, changeMatrixState] = useState(MatrixState.ready);
    let [secondSetOfKeysActive, changeSecondSetOfKeysActive] = useState(false);
    let [columnDirectionActive, changeColumnDirectionActive] = useState(false);

    function getNewNumberConfigs(matrix) {
        if (
            selectedMatrixElement.row == matrix.dimensions().rows - 1
            && selectedMatrixElement.column == matrix.dimensions().columns - 1
        ) {
            return {
                number: null,
                selectedElement: null,
            };
        } else {
            if (columnDirectionActive) {
                if (selectedMatrixElement.row < matrix.dimensions().rows - 1) {
                    return {
                        number: matrix.data
                            [selectedMatrixElement.row + 1]
                            [selectedMatrixElement.column],
                        selectedElement: {
                            ...selectedMatrixElement,
                            row: selectedMatrixElement.row + 1,
                        },
                    };
                } else {
                    return {
                        number: matrix.data
                            [0]
                            [selectedMatrixElement.column + 1],
                        selectedElement: {
                            column: selectedMatrixElement.column + 1,
                            row: 0,
                        },
                    };
                }
            } else {
                if (selectedMatrixElement.column < matrix.dimensions().columns - 1) {
                    return {
                        number: matrix.data
                            [selectedMatrixElement.row]
                            [selectedMatrixElement.column + 1],
                        selectedElement: {
                            ...selectedMatrixElement,
                            column: selectedMatrixElement.column + 1,
                        },
                    };
                } else {
                    return {
                        number: matrix.data
                            [selectedMatrixElement.row + 1]
                            [0],
                        selectedElement: {
                            row: selectedMatrixElement.row + 1,
                            column: 0,
                        },
                    };
                }
            }
        }
    }
    
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#000',
                justifyContent: 'flex-end',
            }}
        >
            <StatusBar barStyle='light-content' />
            <InfoArea 
                matrixState={matrixState}
                currentMatrix={currentMatrix}
                changeCurrentMatrix={changeCurrentMatrix}
                editableMatrix={editableMatrix}
                changeEditableMatrix={changeEditableMatrix}
                selectedMatrixElement={selectedMatrixElement}
                changeSelectedMatrixElement={
                    ({ row, column }) => {
                        changeSelectedMatrixElement({ row, column });

                        if (matrixState == MatrixState.ready) {
                            changeMatrixState(MatrixState.editing);
                            changeEditableMatrix(currentMatrix);
                            changeEditableDimensions(currentMatrix.dimensions());
                        }
                    }
                }
                editableDimensions={editableDimensions}
                changeEditableDimensions={changeEditableDimensions}
                numberWritten={numberWritten}
                changeNumberWritten={
                    (number) => changeNumberWritten(
                        (!selectedMatrixElement && numberWritten) || number
                    )
                }
            />
            <ButtonsArea
                matrixState={matrixState}
                numberWritten={numberWritten}
                onPressCE={
                    () => changeNumberWritten(null)
                }
                onPressAC={
                    matrixState == MatrixState.ready
                        ? () => changeCurrentMatrix(NULL_MATRIX())
                        : () => {
                            changeMatrixState(MatrixState.ready);
                            changeSelectedMatrixElement(null);
                        }
                }
                numberButtonPressed={
                    (element) => {
                        if ((numberWritten || '').length == 0 && element == ',')
                            changeNumberWritten('0,');
                        else if (count(numberWritten || '', ',') == 0 || element != ',')
                            changeNumberWritten((numberWritten || '').toString() + element);
                    }
                }
                secondSetOfKeysActive={secondSetOfKeysActive}
                changeSecondSetOfKeysActive={
                    () => changeSecondSetOfKeysActive(!secondSetOfKeysActive)
                }
                columnDirectionActive={columnDirectionActive}
                changeColumnDirectionActive={
                    () => changeColumnDirectionActive(!columnDirectionActive)
                }
                currentMatrix={currentMatrix}
                changeCurrentMatrix={changeCurrentMatrix}
                selectedMatrixElement={selectedMatrixElement}
                onEnter={() => {

                    changeEditableMatrix(
                        MatrixOperations.changeElement({
                            currentMatrix: editableMatrix,
                            ...selectedMatrixElement,
                            numberWritten,
                        })
                    );

                    const { number, selectedElement } = getNewNumberConfigs(editableMatrix);

                    changeNumberWritten(number);
                    changeSelectedMatrixElement(selectedElement);

                }}
                checkActive={MatrixOperations.isMatrixFull(editableMatrix)}
                onCheck={() => {
                    changeCurrentMatrix(editableMatrix);
                    changeMatrixState(MatrixState.ready);
                }}
            />
        </SafeAreaView>
    );
}
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Dimensions } from 'react-native';
import ButtonsArea from './components/ButtonsArea';
import InfoArea from './components/InfoArea';
import { MatrixState, count } from './utilities/constants';
import MatrixOperations from './utilities/MatrixOperations';

const INITIAL_MATRIX = MatrixOperations.emptyMatrix({
    rows: 3,
    columns: 1,
});

export default function CalculatorScreen({ isPortrait }) {
    let [readyMatrix, changeReadyMatrix] = useState(INITIAL_MATRIX);
    let [editableMatrix, changeEditableMatrix] = useState(INITIAL_MATRIX);
    let [selectedMatrixElement, changeSelectedMatrixElement] = useState({
        row: 0,
        column: 0,
    });
    let [editableDimensions, changeEditableDimensions] = useState(INITIAL_MATRIX.dimensions());
    let [matrixState, changeMatrixState] = useState(MatrixState.editing);
    let [secondSetOfKeysActive, changeSecondSetOfKeysActive] = useState(false);
    let [columnDirectionActive, changeColumnDirectionActive] = useState(true);

    function safeChangeReadyMatrix(matrix) {
        changeReadyMatrix(
            MatrixOperations.convertStringToNumbers(matrix)
        );
    }

    function safeChangeEditableMatrix(matrix) {
        changeEditableMatrix(
            MatrixOperations.convertStringToNumbers(matrix)
        );
    }

    const matrixOnScreen = matrixState === MatrixState.ready 
        ? readyMatrix
        : editableMatrix;

    function enterEditingMode({ editableMatrix, matrixState, selectedElement }) {
        changeMatrixState(matrixState);
        safeChangeEditableMatrix(editableMatrix);
        changeEditableDimensions(editableMatrix.dimensions());
        selectedElement && changeSelectedMatrixElement(selectedElement);
    }

    function changeNumberWritten(newNumber) {
        selectedMatrixElement && safeChangeEditableMatrix(
            MatrixOperations.changeElement({
                matrix: editableMatrix || readyMatrix,
                ...selectedMatrixElement,
                numberWritten: newNumber,
            })
        );
    }

    function getNumberWritten() {
        const { row, column } = selectedMatrixElement || {};
        return (
                (
                    editableMatrix 
                    && editableMatrix.data 
                    && editableMatrix.data[row] 
                    && editableMatrix.data[row][column]
                ) || ''
            ).toString();
    }

    function nextElement() {
        const { row, column } = selectedMatrixElement;
        const maxRows = editableMatrix.dimensions().rows;
        const maxColumns = editableMatrix.dimensions().columns;
        
        let selectedElement = {row: null, column: null};

        if (
            !(row == maxRows - 1
            && column == maxColumns - 1)
            && selectedElement
        ) {
            if (columnDirectionActive) {
                if (row < maxRows - 1) {
                    selectedElement.column = column;
                    selectedElement.row = row + 1;
                } else {
                    selectedElement.column = column + 1;
                    selectedElement.row = 0;
                }
            } else {
                if (column < maxColumns - 1) {
                    selectedElement.column = column + 1;
                    selectedElement.row = row;
                } else {
                    selectedElement.column = 0;
                    selectedElement.row = row + 1;
                }
            }
        } else selectedElement = null;

        changeSelectedMatrixElement(selectedElement);
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
                readyMatrix={readyMatrix}
                safeChangeReadyMatrix={changeReadyMatrix}
                onPressBackground={
                    () => {
                        changeMatrixState(MatrixState.ready);
                        matrixState === MatrixState.editing 
                            && safeChangeReadyMatrix(editableMatrix);
                        changeSelectedMatrixElement(null);
                    }
                }
                editableMatrix={editableMatrix}
                changeEditableMatrix={safeChangeEditableMatrix}
                selectedMatrixElement={selectedMatrixElement}
                changeSelectedMatrixElement={
                    (selection) => {
                        changeSelectedMatrixElement(
                            selection === null 
                                ? null 
                                : { 
                                    row: selection.row, 
                                    column: selection.column,
                                }
                        );

                        if (matrixState === MatrixState.ready) {
                            enterEditingMode({
                                matrixState: MatrixState.editing,
                                editableMatrix: readyMatrix,
                            });
                        }
                    }
                }
                editableDimensions={editableDimensions}
                changeEditableDimensions={changeEditableDimensions}
            />
            <ButtonsArea
                hidden={!isPortrait}
                matrixState={matrixState}
                matrixOnScreen={matrixOnScreen}
                readyMatrix={readyMatrix}
                changeReadyMatrix={safeChangeReadyMatrix}
                numberWritten={getNumberWritten()}
                secondSetOfKeysActive={secondSetOfKeysActive}
                changeSecondSetOfKeysActive={
                    () => changeSecondSetOfKeysActive(!secondSetOfKeysActive)
                }
                columnDirectionActive={columnDirectionActive}
                changeColumnDirectionActive={
                    () => changeColumnDirectionActive(!columnDirectionActive)
                }
                selectedMatrixElement={selectedMatrixElement}
                onPressAC={
                    () => {
                        const changeMatrixOnScreen = matrixState === MatrixState.ready 
                            ? safeChangeReadyMatrix
                            : safeChangeEditableMatrix;

                        changeMatrixOnScreen(
                            MatrixOperations.emptyMatrix(matrixOnScreen.dimensions())
                        );

                        if (MatrixOperations.isMatrixEmpty(matrixOnScreen)) {
                            changeMatrixState(MatrixState.ready);
                            changeSelectedMatrixElement(null);
                        }
                    }
                }
                onPressCE={
                    () => changeNumberWritten(null)
                }
                numberButtonPressed={
                    (element) => {
                        if (getNumberWritten().length == 0 && element == ',')
                            changeNumberWritten('0,');
                        else if (count(getNumberWritten(), ',') == 0 || element != ',')
                            changeNumberWritten(getNumberWritten() + element);
                    }
                }
                onPressAxB={() => {
                    matrixState !== MatrixState.ready && safeChangeReadyMatrix(editableMatrix);
                    enterEditingMode({
                        matrixState: MatrixState.AxB,
                        editableMatrix: MatrixOperations.emptyMatrix(
                            MatrixOperations.getTransposedDimensions(matrixOnScreen)
                        ),
                        selectedElement: {
                            row: 0,
                            column: 0,
                        },
                    });
                }}
                onPressBxA={() => {
                    matrixState !== MatrixState.ready && safeChangeReadyMatrix(editableMatrix);
                    enterEditingMode({
                        matrixState: MatrixState.BxA,
                        editableMatrix: MatrixOperations.emptyMatrix(
                            MatrixOperations.getTransposedDimensions(matrixOnScreen)
                        ),
                        selectedElement: {
                            row: 0,
                            column: 0,
                        },
                    });
                }}
                onPressAddMatrix={() => {
                    matrixState !== MatrixState.ready && safeChangeReadyMatrix(editableMatrix);
                    enterEditingMode({
                        matrixState: MatrixState.addMatrix,
                        editableMatrix: MatrixOperations.emptyMatrix(matrixOnScreen.dimensions()),
                        selectedElement: {
                            row: 0,
                            column: 0,
                        },
                    });
                }}
                onPressSubtractMatrix={() => {
                    matrixState !== MatrixState.ready && safeChangeReadyMatrix(editableMatrix);
                    enterEditingMode({
                        matrixState: MatrixState.subtractMatrix,
                        editableMatrix: MatrixOperations.emptyMatrix(matrixOnScreen.dimensions()),
                        selectedElement: {
                            row: 0,
                            column: 0,
                        },
                    });
                }}
                onPressResolveEquation={() => {
                    
                }}
                onPressSave={() => {
                    
                }}
                onPressSavedList={() => {
                    
                }}
                onTranspose={() => {
                    
                    if (matrixState === MatrixState.ready) {
                        safeChangeReadyMatrix(
                            MatrixOperations.transpose(readyMatrix)
                        );
                    }

                    else {
                        safeChangeEditableMatrix(
                            MatrixOperations.transpose(editableMatrix)
                        );
                        changeSelectedMatrixElement({
                            row: selectedMatrixElement.column,
                            column: selectedMatrixElement.row,
                        });
                        changeEditableDimensions({
                            rows: editableDimensions.columns,
                            columns: editableDimensions.rows,
                        });
                    }
                    
                }}
                onInvert={() => {
                    
                    if (matrixState === MatrixState.ready) {
                        safeChangeReadyMatrix(
                            MatrixOperations.invert(readyMatrix)
                        );
                    }

                    else {
                        safeChangeEditableMatrix(
                            MatrixOperations.invert(editableMatrix)
                        );
                    }
                    
                }}
                onEnter={nextElement}
                isMatrixFull={MatrixOperations.isMatrixFull(matrixOnScreen)}
                isMatrixSquare={MatrixOperations.isMatrixSquare(matrixOnScreen)}
                onCheck={() => {
                    switch (matrixState) {
                        case MatrixState.editing:
                            safeChangeReadyMatrix(editableMatrix);
                            break;
                        case MatrixState.addMatrix:
                            safeChangeReadyMatrix(
                                MatrixOperations.sum(readyMatrix, editableMatrix)
                            );
                            break;
                        case MatrixState.subtractMatrix:
                            safeChangeReadyMatrix(
                                MatrixOperations.subtract(readyMatrix, editableMatrix)
                            );
                            break;
                        case MatrixState.AxB:
                            safeChangeReadyMatrix(
                                MatrixOperations.multiplyMatrix(readyMatrix, editableMatrix)
                            );
                            break;
                        case MatrixState.BxA:
                            safeChangeReadyMatrix(
                                MatrixOperations.multiplyMatrix(editableMatrix, readyMatrix)
                            );
                            break;
                        default:
                            break;
                    }
                    changeMatrixState(MatrixState.ready);
                }}
            />
        </SafeAreaView>
    );
}
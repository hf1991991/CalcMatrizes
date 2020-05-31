import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Dimensions } from 'react-native';
import ButtonsArea from './components/ButtonsArea';
import InfoArea from './components/InfoArea';
import { MatrixState, count, Operator } from './utilities/constants';
import MatrixOperations from './utilities/MatrixOperations';
import ScalarOperations from './utilities/ScalarOperations';

const INITIAL_MATRIX = MatrixOperations.emptyMatrix({
    rows: 3,
    columns: 1,
});

export default function CalculatorScreen({ isPortrait }) {
    let [readyMatrix, changeReadyMatrix] = useState(INITIAL_MATRIX);
    let [editableMatrix, changeEditableMatrix] = useState(INITIAL_MATRIX);
    let [editableScalar, changeEditableScalar] = useState(null);
    let [selectedMatrixElement, changeSelectedMatrixElement] = useState({
        row: 0,
        column: 0,
    });
    let [shouldUserInputOverwriteElement, changeShouldUserInputOverwriteElement] = useState(true);
    let [editableDimensions, changeEditableDimensions] = useState(INITIAL_MATRIX.dimensions());
    let [matrixState, changeMatrixState] = useState(MatrixState.editing);
    let [secondSetOfKeysActive, changeSecondSetOfKeysActive] = useState(false);
    let [operatorsActive, changeOperatorsButtonActive] = useState(false);
    let [selectedOperator, changeSelectedOperator] = useState(null);
    let [operationHappening, changeOperationHappening] = useState(false);
    let [editableOperatorNumber, changeEditableOperatorNumber] = useState(null);
    let [columnDirectionActive, changeColumnDirectionActive] = useState(true);

    function printState() {
        console.log({
            readyMatrix,
            editableMatrix,
            editableScalar,
            selectedMatrixElement,
            shouldUserInputOverwriteElement,
            editableDimensions,
            matrixState,
            secondSetOfKeysActive,
            columnDirectionActive,
            numberWritten: getNumberWritten(),
            operatorsActive,
            selectedOperator,
            operationHappening,
            editableOperatorNumber,
        })
    }

    function changeSettingsOfSelectedMatrixElement(selectedElement) {
        changeSelectedMatrixElement(selectedElement);
        changeShouldUserInputOverwriteElement(true);
    }

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

    function enterEditingMode({ editableMatrix, matrixState, selectedElement, scalar }) {
        changeMatrixState(matrixState);
        safeChangeEditableMatrix(editableMatrix);
        changeEditableDimensions(
            editableMatrix 
                ? editableMatrix.dimensions()
                : null
        );
        changeEditableScalar(scalar);
        selectedElement !== undefined && changeSettingsOfSelectedMatrixElement(selectedElement);
    }

    function changeNumberWritten({ newNumber, forceNotOperatorNumber=false }) {
        if (operationHappening && !forceNotOperatorNumber) {
            changeEditableOperatorNumber(newNumber);
        }

        else if (matrixState === MatrixState.LambdaxA) {
            changeEditableScalar(newNumber);
        }

        else {
            safeChangeEditableMatrix(
                MatrixOperations.changeElement({
                    matrix: editableMatrix || readyMatrix,
                    ...selectedMatrixElement,
                    numberWritten: newNumber,
                })
            )
        } 
    }

    function getNumberWritten({ forceNotOperatorNumber=false }={}) {
        if (operationHappening && !forceNotOperatorNumber) 
            return editableOperatorNumber === null
                ? ''
                : editableOperatorNumber;

        if (shouldUserInputOverwriteElement && !forceNotOperatorNumber) return '';

        if (matrixState === MatrixState.LambdaxA) 
            return editableScalar === null
                ? ''
                : editableScalar;

        const { row, column } = selectedMatrixElement || {};
        const matrixNumber = editableMatrix 
            && editableMatrix.data 
            && editableMatrix.data[row] 
            && editableMatrix.data[row][column];
        
        return (
            (matrixNumber === null || matrixNumber === undefined)
                ? ''
                : matrixNumber
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

        changeSettingsOfSelectedMatrixElement(selectedElement);
    }

    function isEditableScalarReady() {
        return editableScalar !== null && !editableScalar.toString().endsWith('.');
    }

    function resetScalarOperations() {
        changeEditableOperatorNumber(null);
        changeOperationHappening(false);
        changeSelectedOperator(null);
    }

    function applyOperation() {
        resetScalarOperations();

        changeNumberWritten({
            newNumber: ScalarOperations.applyOperation({
                operation: selectedOperator,
                scalar1: getNumberWritten({ forceNotOperatorNumber: true }),
                scalar2: editableOperatorNumber
            }),
            forceNotOperatorNumber: true,
        });
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
                        if (matrixState !== MatrixState.LambdaxA) {
                            changeMatrixState(MatrixState.ready);
                            matrixState === MatrixState.editing 
                                && safeChangeReadyMatrix(editableMatrix);
                            changeSettingsOfSelectedMatrixElement(null);
                        }
                    }
                }
                editableMatrix={editableMatrix}
                changeEditableMatrix={safeChangeEditableMatrix}
                selectedMatrixElement={selectedMatrixElement}
                changeSelectedMatrixElement={
                    (selection) => {
                        changeSettingsOfSelectedMatrixElement(
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
                editableScalar={editableScalar}
                operationHappening={operationHappening}
                editableOperatorNumber={editableOperatorNumber}
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
                isMatrixFull={MatrixOperations.isMatrixFull(matrixOnScreen)}
                isMatrixSquare={MatrixOperations.isMatrixSquare(matrixOnScreen)}
                isKeyboardBeActive={selectedMatrixElement || matrixState === MatrixState.LambdaxA}
                isCheckActive={
                    matrixState !== MatrixState.LambdaxA
                        ? MatrixOperations.isMatrixFull(matrixOnScreen)
                        : isEditableScalarReady()
                }
                operatorsActive={operatorsActive}
                changeOperatorsButtonActive={() => {
                    changeOperatorsButtonActive(!operatorsActive);
                    operatorsActive && resetScalarOperations();
                }}
                selectedOperator={selectedOperator}
                editableOperatorNumber={editableOperatorNumber}
                onPressAC={
                    () => {
                        resetScalarOperations();

                        if (matrixState !== MatrixState.LambdaxA) {
                            const changeMatrixOnScreen = matrixState === MatrixState.ready 
                                ? safeChangeReadyMatrix
                                : safeChangeEditableMatrix;
    
                            changeMatrixOnScreen(
                                MatrixOperations.emptyMatrix(matrixOnScreen.dimensions())
                            );
    
                            if (MatrixOperations.isMatrixEmpty(matrixOnScreen)) {
                                changeMatrixState(MatrixState.ready);
                                changeSettingsOfSelectedMatrixElement(0);
                            }
                        } else {
                            changeMatrixState(MatrixState.ready);
                        }
                    }
                }
                onPressCE={
                    () => {
                        changeNumberWritten({
                            newNumber: null,
                        })
                    }
                }
                numberButtonPressed={
                    (element) => {
                        if (getNumberWritten().length === 0 && element === '.')
                            changeNumberWritten({ newNumber: '0.' });
                        else if (count(getNumberWritten(), /\./, true) === 0 || element !== '.')
                            changeNumberWritten({ newNumber: getNumberWritten() + element });
                        
                        changeShouldUserInputOverwriteElement(false);
                    }
                }
                onPressOperator={(operator) => {
                    operationHappening && applyOperation();
                    changeOperationHappening(true);
                    changeEditableOperatorNumber(null);
                    changeSelectedOperator(operator);
                }}
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
                onPressLambdaxA={() => {
                    matrixState !== MatrixState.ready && safeChangeReadyMatrix(editableMatrix);
                    enterEditingMode({
                        matrixState: MatrixState.LambdaxA,
                        editableMatrix: null,
                        selectedElement: null,
                        scalar: null,
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
                        changeSettingsOfSelectedMatrixElement({
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
                        safeChangeReadyMatrix(
                            MatrixOperations.invert(editableMatrix)
                        );
                        changeSettingsOfSelectedMatrixElement(null);
                        changeMatrixState(MatrixState.ready);
                    }
                    
                }}
                onEnter={() => {
                    operationHappening && applyOperation();
                    nextElement();
                }}
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
                        case MatrixState.LambdaxA:
                            safeChangeReadyMatrix(
                                MatrixOperations.multiplyMatrixByScalar({
                                    matrixA: readyMatrix,
                                    scalar: editableScalar,
                                })
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
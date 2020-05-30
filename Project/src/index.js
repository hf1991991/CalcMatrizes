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
    let [selectedMatrixElement, changeSelectedMatrixElement] = useState(null);
    let [editableDimensions, changeEditableDimensions] = useState(null);
    let [matrixState, changeMatrixState] = useState(MatrixState.ready);
    let [secondSetOfKeysActive, changeSecondSetOfKeysActive] = useState(false);
    let [columnDirectionActive, changeColumnDirectionActive] = useState(false);

    function changeNumberWritten(newNumber) {
        selectedMatrixElement && changeEditableMatrix(
            MatrixOperations.changeElement({
                matrix: editableMatrix || currentMatrix,
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
                numberWritten={getNumberWritten()}
                changeNumberWritten={changeNumberWritten}
            />
            <ButtonsArea
                matrixState={matrixState}
                numberWritten={getNumberWritten()}
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
                        if (getNumberWritten().length == 0 && element == ',')
                            changeNumberWritten('0,');
                        else if (count(getNumberWritten(), ',') == 0 || element != ',')
                            changeNumberWritten(getNumberWritten() + element);
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
                onTranspose={() => {
                    changeCurrentMatrix(
                        new MatrixData({
                            data: MatrixOperations.transpose(currentMatrix)
                        })
                    );
                }}
                onEnter={nextElement}
                isMatrixFull={MatrixOperations.isMatrixFull(editableMatrix)}
                onCheck={() => {
                    changeCurrentMatrix(editableMatrix);
                    changeMatrixState(MatrixState.ready);
                }}
            />
        </SafeAreaView>
    );
}
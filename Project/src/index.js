import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import ButtonsArea from './components/ButtonsArea';
import InfoArea from './components/InfoArea';
import { KeyboardState, count } from './utilities/constants';
import MatrixOperations from './utilities/MatrixOperations';
import MatrixData from './utilities/MatrixData';

export default function App() {
    let [currentMatrix, changeCurrentMatrix] = useState(
        new MatrixData({
            data: [
                [1,2,5],
                [4,702,3],
                [9,9,9000],
            ]
        })
    );
    let [editableMatrix, changeEditableMatrix] = useState(null);
    let [numberWritten, changeNumberWritten] = useState(null);
    let [selectedMatrixElement, changeSelectedMatrixElement] = useState(null);
    let [editableDimensions, changeEditableDimensions] = useState(null);
    let [keyboardState, changeKeyboardState] = useState(KeyboardState.matrixReady);
    let [secondSetOfKeysActive, changeSecondSetOfKeysActive] = useState(false);
    let [columnDirectionActive, changeColumnDirectionActive] = useState(false);

    function getNewNumberConfigs() {
        if (
            selectedMatrixElement.row == currentMatrix.dimensions().rows - 1
            && selectedMatrixElement.column == currentMatrix.dimensions().columns - 1
        ) {
            return {
                number: null,
                selectedElement: null,
            };
        } else {
            if (columnDirectionActive) {
                if (selectedMatrixElement.row < currentMatrix.dimensions().rows - 1) {
                    return {
                        number: currentMatrix.data
                            [selectedMatrixElement.row + 1]
                            [selectedMatrixElement.column],
                        selectedElement: {
                            ...selectedMatrixElement,
                            row: selectedMatrixElement.row + 1,
                        },
                    };
                } else {
                    return {
                        number: currentMatrix.data
                            [0]
                            [selectedMatrixElement.column + 1],
                        selectedElement: {
                            column: selectedMatrixElement.column + 1,
                            row: 0,
                        },
                    };
                }
            } else {
                if (selectedMatrixElement.column < currentMatrix.dimensions().columns - 1) {
                    return {
                        number: currentMatrix.data
                            [selectedMatrixElement.row]
                            [selectedMatrixElement.column + 1],
                        selectedElement: {
                            ...selectedMatrixElement,
                            column: selectedMatrixElement.column + 1,
                        },
                    };
                } else {
                    return {
                        number: currentMatrix.data
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
                currentMatrix={currentMatrix}
                changeCurrentMatrix={changeCurrentMatrix}
                editableMatrix={editableMatrix}
                changeEditableMatrix={changeEditableMatrix}
                selectedMatrixElement={selectedMatrixElement}
                changeSelectedMatrixElement={
                    ({ row, column }) => {
                        changeSelectedMatrixElement({ row, column });
                        changeEditableMatrix(currentMatrix);
                        changeEditableDimensions(currentMatrix.dimensions());
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
                keyboardState={
                    selectedMatrixElement 
                        ? KeyboardState.changingMatrix 
                        : keyboardState
                }
                numberWritten={numberWritten}
                onPressCE={
                    () => changeNumberWritten(null)
                }
                onPressAC={
                    () => changeSelectedMatrixElement(null)
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
                onEnter={() => {
                    changeCurrentMatrix(
                        MatrixOperations.changeElement({
                            currentMatrix,
                            ...selectedMatrixElement,
                            numberWritten,
                        })
                    );

                    const { number, selectedElement } = getNewNumberConfigs();

                    changeNumberWritten(number);
                    changeSelectedMatrixElement(selectedElement);

                }}
            />
        </SafeAreaView>
    );
}
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CalcState, count, SystemSolutionType, Operator } from '../utilities/constants';
import MatrixOperations from '../utilities/MatrixOperations';
import ScalarOperations from '../utilities/ScalarOperations';
import { simplifyExpression, varOperation } from '../utilities/ExpressionSimplification';
import { ElementData, VariableData, ExpressionData } from '../utilities/ExpressionClasses';

const INITIAL_MATRIX = MatrixOperations.emptyMatrix({
    rows: 3,
    columns: 1,
});

const CalculatorContext = createContext({});

export const CalculatorProvider = ({ children }) => {
    const [data, setData] = useState({
        calcState: CalcState.editing,
        matrixData: {
            readyMatrix: INITIAL_MATRIX,
            editableMatrix: INITIAL_MATRIX,
            selectedMatrixElement: {
                row: 0,
                column: 0,
            },
            shouldUserInputOverwriteElement: true,
            editableDimensions: INITIAL_MATRIX.dimensions()
        },
        scalarData: {
            editableScalar: null,
            fullScreenDeterminant: false
        },
        operationsData: {
            operationHappening: false,
            editableOperatorNumber: null,
            solutionType: null,
            fullEquation: null,
            viewReduced: false
        },
        buttonsData: {
            secondSetOfKeysActive: false,
            isRActive: false,
            columnDirectionActive: true,
            isVariableKeyboardActive: false,
            selectedOperator: null
        }
    });

    const setCalcState = useCallback(
        newState => setData({
            ...data,
            calcState: newState
        }), [setData, data]
    );

    const setMatrixData = useCallback(
        newMatrixData => setData({
            ...data,
            matrixData: newMatrixData
        }), [setData, data]
    );

    const setScalarData = useCallback(
        newScalarData => setData({
            ...data,
            scalarData: newScalarData
        }), [setData, data]
    );

    const setOperationsData = useCallback(
        newOperationsData => setData({
            ...data,
            operationsData: newOperationsData
        }), [setData, data]
    );

    const setButtonsData = useCallback(
        newButtonsData => setData({
            ...data,
            buttonsData: newButtonsData
        }), [setData, data]
    );

    const isNumberKeyboardActive = useMemo(
        () => data.matrixData.selectedMatrixElement || data.calcState === CalcState.LambdaxA,
        [data]
    );

    const matrixOnScreen = useMemo(
        () => data.calcState === CalcState.ready
            ? data.matrixData.readyMatrix
            : data.matrixData.editableMatrix,
        [data]
    );

    const changeMatrixOnScreen = useMemo(
        () => (newMatrix) => setMatrixData(
            ...data.matrixData,
            ...(
                CalcState.ready
                    ? { readyMatrix: newMatrix }
                    : { editableMatrix: newMatrix }
            )
        )
        [data, setMatrixData]
    );

    const isMatrixSquare = useMemo(
        () => MatrixOperations.isMatrixSquare(matrixOnScreen),
        [matrixOnScreen]
    );

    const isMatrixFull = useMemo(
        () => MatrixOperations.isMatrixFull(matrixOnScreen),
        [matrixOnScreen]
    );

    const isInverseEnabled = useMemo(
        () => MatrixOperations.isMatrixFull(matrixOnScreen)
            && MatrixOperations.isMatrixSquare(matrixOnScreen)
            && MatrixOperations.determinant(matrixOnScreen) !== 0.0,
        [matrixOnScreen]
    );

    const isEditableScalarReady = useMemo(
        () => !data.scalarData?.editableScalar?.stringify().toString().endsWith('.'),
        [data]
    );

    const isCheckActive = useMemo(
        () => data.calcState !== CalcState.LambdaxA
            ? MatrixOperations.isMatrixFull(matrixOnScreen)
            : isEditableScalarReady,
        [data, matrixOnScreen, isEditableScalarReady]
    );

    const isAFirst = useMemo(
        () => {
            return ![
                CalcState.BxA,
                CalcState.BxXeA,
                CalcState.XxBeA,
            ].includes(data.calcState);
        }, [data]
    );

    const getNumberWritten = useCallback(
        ({ forceNotOperatorNumber = false, doNotStringify = false } = {}) => {

            const { operationHappening, editableOperatorNumber } = data.operationsData;

            const {
                shouldUserInputOverwriteElement,
                selectedMatrixElement,
                editableMatrix
            } = data.matrixData;

            const { editableScalar } = data.scalarData;

            if (operationHappening && !forceNotOperatorNumber)
                return editableOperatorNumber === null && !doNotStringify
                    ? ''
                    : editableOperatorNumber;

            const { row, column } = selectedMatrixElement || {};
            const matrixNumber = data.calcState === CalcState.LambdaxA
                ? editableScalar
                : editableMatrix?.data[row]
                && editableMatrix.data[row][column];

            if (
                (
                    shouldUserInputOverwriteElement
                    || (
                        matrixNumber instanceof ElementData
                        && matrixNumber.scalar === 0
                    )
                ) && !forceNotOperatorNumber
            )
                return doNotStringify
                    ? null
                    : '';

            return doNotStringify
                ? matrixNumber
                : matrixNumber?.commaStringify({ dontFindFraction: true });

        }, [data]
    );

    const changeNumberWritten = useCallback(
        ({ newNumber, forceNotOperatorNumber = false }) => {

            if (data.operationsData.operationHappening && !forceNotOperatorNumber)
                setOperationsData({
                    ...data.operationsData,
                    editableOperatorNumber: newNumber
                });

            else if (data.calcState === CalcState.LambdaxA)
                setScalarData({
                    ...data.scalarData,
                    editableScalar: newNumber
                });

            else {
                setMatrixData({
                    ...data.matrixData,
                    editableMatrix: MatrixOperations.changeElement({
                        matrix: data.matrixData.editableMatrix || data.matrixData.readyMatrix,
                        ...data.matrixData.selectedMatrixElement,
                        numberWritten: newNumber,
                    })
                });
            }

        }, [
        setOperationsData,
        setScalarData,
        data,
        setMatrixData
    ]
    );

    const changeViewReduced = useCallback(
        () => setOperationsData({
            ...data.operationsData,
            viewReduced: !data.operationsData.viewReduced
        }), [setOperationsData, data]
    );

    const changeFullScreenDeterminant = useCallback(
        () => setScalarData({
            ...data.scalarData,
            fullScreenDeterminant: !data.scalarData.fullScreenDeterminant
        }), [setScalarData, data]
    );

    const onPressNumberButton = useCallback(
        (element) => {
            console.log(JSON.stringify({
                selected: data.matrixData.selectedMatrixElement
            }))

            const originalValue = getNumberWritten({ doNotStringify: true });

            const letters = /^[a-i]+$/;

            if (element.toString().match(letters))
                changeNumberWritten({
                    newNumber: new ElementData({
                        scalar: originalValue !== null
                            ? originalValue.scalar
                            : 1,
                        variables: [
                            new VariableData({
                                variable: element
                            }),
                            ...((originalValue !== null && originalValue.variables) || [])
                        ]
                    })
                });

            else if (getNumberWritten().length === 0 && element === '.')
                changeNumberWritten({
                    newNumber: new ElementData({
                        scalar: '0.'
                    })
                });

            else if (count(getNumberWritten(), /\./, true) === 0 || element !== '.') {

                changeNumberWritten({
                    newNumber: new ElementData({
                        scalar: originalValue === null
                            ? element
                            : originalValue.scalar !== 1
                                ? originalValue.scalar.toString() + element
                                : element,
                        variables: (originalValue !== null && originalValue.variables) || []
                    })
                });
            }

            setMatrixData({
                ...data.matrixData,
                shouldUserInputOverwriteElement: false
            });

        }, [getNumberWritten, data, changeNumberWritten, setMatrixData]
    );

    const changeSettingsOfSelectedMatrixElement = useCallback(
        (selectedElement) => {
            setMatrixData({
                ...data.matrixData,
                shouldUserInputOverwriteElement: true,
                selectedMatrixElement: selectedElement
            })
        }, [setMatrixData, data]
    );

    const changeSelectedMatrixElement = useCallback(
        (selectedElement) => {

            console.log({ selectedElement });

            data.operationsData.operationHappening && applyOperation();

            changeSettingsOfSelectedMatrixElement(selectedElement);

            if (data.calcState === CalcState.ready) {
                enterEditingMode({
                    calcState: CalcState.editing,
                    editableMatrix: data.matrixData.readyMatrix,
                    selectedElement
                });
            }
        }, [applyOperation, data, changeSettingsOfSelectedMatrixElement, enterEditingMode]
    );


    const changeColumnDirectionActive = useCallback(
        () => setButtonsData({
            ...data.buttonsData,
            columnDirectionActive: !data.buttonsData.columnDirectionActive
        }),
        [data, setButtonsData]
    );

    const changeSecondSetOfKeysActive = useCallback(
        () => setButtonsData({
            ...data.buttonsData,
            secondSetOfKeysActive: !data.buttonsData.secondSetOfKeysActive
        }), [data, setButtonsData]
    )

    const enterEditingMode = useCallback(
        ({ editableMatrix, calcState, selectedElement = undefined, scalar }) => {
            setCalcState(calcState);

            setMatrixData({
                ...data.matrixData,
                fullEquation: null,
                editableMatrix,
                editableDimensions: editableMatrix
                    ? editableMatrix.dimensions()
                    : null
            });

            setOperationsData({
                ...data.operationsData,
                solutionType: null
            });

            setScalarData({
                ...data.scalarData,
                editableScalar: scalar
            });

            selectedElement !== undefined && changeSettingsOfSelectedMatrixElement(selectedElement);
        }, [
        setCalcState,
        setMatrixData,
        data,
        setOperationsData,
        setScalarData,
        changeSettingsOfSelectedMatrixElement
    ]
    );

    const exitEditingMode = useCallback(
        () => setCalcState(CalcState.ready),
        [setCalcState]
    );

    const nextElement = useCallback(
        () => {
            const { row, column } = data.matrixData.selectedMatrixElement;
            const maxRows = data.matrixData.editableMatrix.dimensions().rows;
            const maxColumns = data.matrixData.editableMatrix.dimensions().columns;

            let selectedElement = { row: null, column: null };

            if (
                !(row == maxRows - 1
                    && column == maxColumns - 1)
                && selectedElement
            ) {
                if (data.buttonsData.columnDirectionActive) {
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
        }, [data, changeSettingsOfSelectedMatrixElement]
    );

    const resetScalarOperations = useCallback(
        () => {

            setOperationsData({
                ...data.operationsData,
                editableOperatorNumber: null,
                operationHappening: false
            });

            setButtonsData({
                ...data.buttonsData,
                selectedOperator: null
            });

        }, [setOperationsData, data, setButtonsData]
    );

    const applyOperation = useCallback(
        () => {
            resetScalarOperations();

            if (data.operationsData.editableOperatorNumber !== null)
                changeNumberWritten({
                    newNumber: varOperation(
                        getNumberWritten({ forceNotOperatorNumber: true, doNotStringify: true }),
                        data.buttonsData.selectedOperator,
                        data.operationsData.editableOperatorNumber
                    ),
                    forceNotOperatorNumber: true,
                });
        }, [resetScalarOperations, data, changeNumberWritten, getNumberWritten]
    );

    const solveOperationsFullEquationSetup = useCallback(
        () => {

            const { readyMatrix, editableMatrix } = data.matrixData;

            const {
                partiallyEliminatedOriginal,
                solution,
                systemSolutionsType,
            } = MatrixOperations.findSolutionForMatrixEquation({
                matrixA: isAFirst ? readyMatrix : editableMatrix,
                matrixB: isAFirst ? editableMatrix : readyMatrix,
                verticalElimination: [
                    CalcState.XxAeB,
                    CalcState.XxBeA,
                ].includes(data.calcState),
                showSteps: false,
            });

            setOperationsData({
                ...data.operationsData,
                viewReduced: false,
                fullEquation: {
                    equationType: data.calcState,
                    solutionType: systemSolutionsType,
                    matrixA: readyMatrix,
                    matrixB: editableMatrix,
                    matrixC: solution,
                    matrixD: partiallyEliminatedOriginal
                },
                solutionType: systemSolutionsType
            });

            setMatrixData({
                ...data.matrixData,
                readyMatrix: systemSolutionsType == SystemSolutionType.SPD
                    ? solution
                    : data.matrixData.readyMatrix
            });

        }, [isAFirst, data, setOperationsData, setMatrixData]
    );

    const singleInputFullEquationSetup = useCallback(
        (matrixOperation) => {
            const oldMatrix = matrixOnScreen;

            const newMatrix = matrixOperation === CalcState.transpose
                ? MatrixOperations.transpose(oldMatrix)
                : MatrixOperations.invert(oldMatrix);

            setOperationsData({
                ...data.operationsData,
                fullEquation: {
                    equationType: matrixOperation,
                    matrixA: oldMatrix,
                    matrixB: newMatrix
                },
            });

        }, [matrixOnScreen, setOperationsData, data]
    );

    const scalarFullEquationSetup = useCallback(
        ({ newMatrix, scalar }) => {

            setMatrixData({
                ...data.matrixData,
                readyMatrix: newMatrix
            });

            setOperationsData({
                ...operationsData,
                fullEquation: {
                    equationType: data.calcState,
                    matrixB: data.matrixData.readyMatrix,
                    matrixC: newMatrix,
                    scalar
                },
            });

        }, [setMatrixData, data, setOperationsData]
    );

    const generalFullEquationSetup = useCallback(
        ({ newMatrix }) => {

            setMatrixData({
                ...data.matrixData,
                readyMatrix: newMatrix
            });

            setOperationsData({
                ...data.operationsData,
                fullEquation: {
                    equationType: data.calcState,
                    matrixA: isAFirst ? data.matrixData.readyMatrix : data.matrixData.editableMatrix,
                    matrixB: isAFirst ? data.matrixData.editableMatrix : data.matrixData.readyMatrix,
                    matrixC: newMatrix,
                },
            });

        }, [setMatrixData, data, setOperationsData, isAFirst]
    );

    const onPressInfoAreaBackground = useCallback(
        () => {

            if (data.scalarData.fullScreenDeterminant)
                setScalarData({
                    ...data.scalarData,
                    fullScreenDeterminant: false
                });

            else {
                data.operationsData.operationHappening && applyOperation();

                if (data.calcState !== CalcState.LambdaxA) {
                    setCalcState(CalcState.ready);
                    data.calcState === CalcState.editing
                        && setMatrixData({
                            ...data.matrixData,
                            readyMatrix: data.matrixData.editableMatrix
                        });
                    changeSettingsOfSelectedMatrixElement(null);
                }
            }
        }, [
        setScalarData,
        applyOperation,
        exitEditingMode,
        setCalcState,
        data,
        setMatrixData,
        changeSettingsOfSelectedMatrixElement
    ]
    );

    const changeEditableDimensions = useCallback(
        ({ rows, columns }) => setMatrixData({
            ...data.matrixData,
            editableDimensions: { rows, columns },
            editableMatrix: MatrixOperations.resizeMatrix({
                originalMatrix: data.calcState === CalcState.editing
                    ? data.matrixData.readyMatrix
                    : data.matrixData.editableMatrix,
                editableMatrix: data.matrixData.editableMatrix,
                rows,
                columns,
            }),
            selectedMatrixElement: data.matrixData.selectedMatrixElement?.row >= rows
                || data.matrixData.selectedMatrixElement?.column >= columns
                ? null
                : data.matrixData.selectedMatrixElement
        }), [, data, setMatrixData]
    );

    const onPressAC = useCallback(
        () => {
            resetScalarOperations();

            if (data.calcState !== CalcState.LambdaxA) {

                changeMatrixOnScreen(
                    MatrixOperations.emptyMatrix(matrixOnScreen.dimensions())
                );

                if (MatrixOperations.isMatrixEmpty(matrixOnScreen)) {
                    exitEditingMode();
                    changeSettingsOfSelectedMatrixElement(0);
                }
            } else {
                exitEditingMode();
            }
        }, [
        resetScalarOperations,
        data,
        changeMatrixOnScreen,
        matrixOnScreen,
        exitEditingMode,
        changeSettingsOfSelectedMatrixElement
    ]
    );

    const onPressCE = useCallback(
        () => changeNumberWritten({
            newNumber: new ElementData({
                scalar: 0
            })
        }), [changeNumberWritten]
    );

    const onPressOperator = useCallback(
        (operator) => {
            data.operationsData.operationHappening && applyOperation();

            setOperationsData({
                ...data.operationsData,
                operationHappening: true,
                editableOperatorNumber: null
            });

            setButtonsData({
                ...data.buttonsData,
                selectedOperator: operator
            });
        }, [data, applyOperation, setOperationsData, setButtonsData]
    );

    const onPressAxB = useCallback(
        () => {
            setMatrixData({
                ...data.matrixData,
                readyMatrix: data.calcState !== CalcState.ready
                    ? data.matrixData.editableMatrix
                    : data.matrixData.readyMatrix
            });

            enterEditingMode({
                calcState: CalcState.AxB,
                editableMatrix: MatrixOperations.emptyMatrix(
                    MatrixOperations.getTransposedDimensions(matrixOnScreen)
                ),
                selectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [setMatrixData, data, enterEditingMode, matrixOnScreen]
    );

    const onPressBxA = useCallback(
        () => {
            setMatrixData({
                ...data.matrixData,
                readyMatrix: data.calcState !== CalcState.ready
                    ? data.matrixData.editableMatrix
                    : data.matrixData.readyMatrix
            });

            enterEditingMode({
                calcState: CalcState.BxA,
                editableMatrix: MatrixOperations.emptyMatrix(
                    MatrixOperations.getTransposedDimensions(matrixOnScreen)
                ),
                selectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [setMatrixData, data, enterEditingMode, matrixOnScreen]
    );

    const onPressLambdaxA = useCallback(
        () => {
            setMatrixData({
                ...data.matrixData,
                readyMatrix: data.calcState !== CalcState.ready
                    ? data.matrixData.editableMatrix
                    : data.matrixData.readyMatrix
            });

            enterEditingMode({
                calcState: CalcState.LambdaxA,
                editableMatrix: null,
                selectedElement: null,
                scalar: new ElementData({
                    scalar: 0
                }),
            });

        }, [setMatrixData, data, enterEditingMode]
    );

    const onPressAddMatrix = useCallback(
        () => {
            setMatrixData({
                ...data.matrixData,
                readyMatrix: data.calcState !== CalcState.ready
                    ? data.matrixData.editableMatrix
                    : data.matrixData.readyMatrix
            });

            enterEditingMode({
                calcState: CalcState.addMatrix,
                editableMatrix: MatrixOperations.emptyMatrix(matrixOnScreen.dimensions()),
                selectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [setMatrixData, data, enterEditingMode, matrixOnScreen]
    );

    const onPressSubtractMatrix = useCallback(
        () => {
            setMatrixData({
                ...data.matrixData,
                readyMatrix: data.calcState !== CalcState.ready
                    ? data.matrixData.editableMatrix
                    : data.matrixData.readyMatrix
            });

            enterEditingMode({
                calcState: CalcState.subtractMatrix,
                editableMatrix: MatrixOperations.emptyMatrix(matrixOnScreen.dimensions()),
                selectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [setMatrixData, data, enterEditingMode, matrixOnScreen]
    );

    const onPressR = useCallback(
        () => setButtonsData({
            ...data.buttonsData,
            isRActive: !data.buttonsData.isRActive
        }),
        [data, setButtonsData]
    );

    const onPressResolveEquation = useCallback(
        (newState) => {
            setButtonsData({
                ...data.buttonsData,
                isRActive: !data.buttonsData.isRActive
            });

            setMatrixData({
                ...data.matrixData,
                readyMatrix: data.calcState !== CalcState.ready
                    ? data.matrixData.editableMatrix
                    : data.matrixData.readyMatrix
            });

            enterEditingMode({
                calcState: newState,
                editableMatrix: MatrixOperations.emptyMatrix(matrixOnScreen.dimensions()),
                selectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [
        setButtonsData,
        data,
        setMatrixData,
        data,
        enterEditingMode,
        matrixOnScreen
    ]
    );

    const onTranspose = useCallback(
        () => {

            if (data.calcState === CalcState.ready)
                setMatrixData({
                    ...data.matrixData,
                    readyMatrix: MatrixOperations.transpose(data.matrixData.readyMatrix)
                });

            else {
                const { editableDimensions, selectedMatrixElement } = data.matrixData;
                setMatrixData({
                    ...data.matrixData,
                    editableMatrix: MatrixOperations.transpose(data.matrixData.editableMatrix),
                    editableDimensions: {
                        rows: editableDimensions.columns,
                        columns: editableDimensions.rows,
                    }
                });
                changeSettingsOfSelectedMatrixElement({
                    row: selectedMatrixElement.column,
                    column: selectedMatrixElement.row,
                });
            }

            singleInputFullEquationSetup(CalcState.transpose);

        }, [
        setMatrixData,
        data,
        changeSettingsOfSelectedMatrixElement,
        singleInputFullEquationSetup
    ]
    );

    const onInvert = useCallback(
        () => {

            try {

                if (data.calcState === CalcState.ready) {
                    setMatrixData({
                        ...data.matrixData,
                        readyMatrix: MatrixOperations.invert(data.matrixData.readyMatrix)
                    });
                }

                else {
                    setMatrixData({
                        ...data.matrixData,
                        readyMatrix: MatrixOperations.invert(data.matrixData.editableMatrix),
                    });
                    changeSettingsOfSelectedMatrixElement(null);
                    exitEditingMode();
                }

                singleInputFullEquationSetup(CalcState.invert);

            } catch (e) {
                console.log(e);
            }

        }, [
        setMatrixData,
        data,
        changeSettingsOfSelectedMatrixElement,
        exitEditingMode,
        singleInputFullEquationSetup
    ]
    );

    const onEnter = useCallback(
        () => {
            data.operationsData.operationHappening && applyOperation();
            data.matrixData.selectedMatrixElement && nextElement();
        }, [applyOperation, data, nextElement]
    );

    const onCheck = useCallback(
        () => {
            const { editableMatrix, readyMatrix } = data.matrixData;
            switch (data.calcState) {
                case CalcState.editing:
                    setMatrixData({
                        ...data.matrixData,
                        readyMatrix: editableMatrix
                    });
                    break;
                case CalcState.addMatrix:
                    generalFullEquationSetup({
                        newMatrix: MatrixOperations.sum(readyMatrix, editableMatrix)
                    });
                    break;
                case CalcState.subtractMatrix:
                    generalFullEquationSetup({
                        newMatrix: MatrixOperations.subtract(readyMatrix, editableMatrix)
                    });
                    break;
                case CalcState.AxB:
                    generalFullEquationSetup({
                        newMatrix: MatrixOperations.multiplyMatrix(readyMatrix, editableMatrix)
                    });
                    break;
                case CalcState.BxA:
                    generalFullEquationSetup({
                        newMatrix: MatrixOperations.multiplyMatrix(editableMatrix, readyMatrix),
                    });
                    break;
                case CalcState.LambdaxA:
                    scalarFullEquationSetup({
                        newMatrix: MatrixOperations.multiplyMatrixByScalar({
                            matrixA: readyMatrix,
                            scalar: data.scalarData.editableScalar,
                        }),
                        scalar: data.scalarData.editableScalar,
                    });
                    break;
                case CalcState.AxXeB:
                    solveOperationsFullEquationSetup();
                    break;
                case CalcState.BxXeA:
                    solveOperationsFullEquationSetup();
                    break;
                case CalcState.XxAeB:
                    solveOperationsFullEquationSetup();
                    break;
                case CalcState.XxBeA:
                    solveOperationsFullEquationSetup();
                    break;
                default:
                    break;
            }
            exitEditingMode();
        }, [
        setMatrixData,
        data,
        generalFullEquationSetup,
        solveOperationsFullEquationSetup,
        exitEditingMode
    ]
    );

    return (
        <CalculatorContext.Provider
            value={{
                scalarData: data.scalarData,
                ...data.scalarData,
                ...data.matrixData,
                ...data.operationsData,
                ...data.buttonsData,
                isNumberKeyboardActive,
                matrixOnScreen,
                isMatrixSquare,
                isMatrixFull,
                isInverseEnabled,
                isCheckActive,
                getNumberWritten,
                changeNumberWritten,
                changeEditableDimensions,
                changeSelectedMatrixElement,
                changeColumnDirectionActive,
                changeSecondSetOfKeysActive,
                changeViewReduced,
                changeFullScreenDeterminant,
                onPressInfoAreaBackground,
                onPressNumberButton,
                onPressAC,
                onPressCE,
                onPressAddMatrix,
                onPressSubtractMatrix,
                onPressAxB,
                onPressBxA,
                onPressLambdaxA,
                onPressOperator,
                onPressR,
                onPressResolveEquation,
                onTranspose,
                onInvert,
                onEnter,
                onCheck
            }}
        >
            {children}
        </CalculatorContext.Provider>
    )
}

export const useCalculator = () => useContext(CalculatorContext);
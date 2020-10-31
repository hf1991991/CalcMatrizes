import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CalcState, count, SystemSolutionType, Operator } from '../utilities/constants';
import MatrixOperations from '../utilities/MatrixOperations';
import { varOperation } from '../utilities/ExpressionSimplification';
import { ElementData, VariableData } from '../utilities/ExpressionClasses';
import MatrixData from '../utilities/MatrixData';
import SelectedMatrixElement from '../interfaces/SelectedMatrixElement';
import MatrixDimensions from '../interfaces/MatrixDimensions';
import FullEquationData from '../interfaces/FullEquationData';

interface MatrixHistory {
    history: Array<MatrixData>;
    currentPosition: number;
}

interface ChangeNumberWrittenParams { 
    newNumber: ElementData; 
    forceNotOperatorNumber?: boolean;
}

interface CalculatorContextData {
    // ---- useStates: ----
    // Estado geral da calculadora:
    calcState: CalcState;
    // Estados de matrizes:
    readyMatrix: MatrixData;
    editableMatrix: MatrixData;
    matrixHistory: MatrixHistory;
    selectedMatrixElement: SelectedMatrixElement | null;
    shouldUserInputOverwriteElement: boolean;
    editableDimensions: MatrixDimensions;
    // Estados de escalares:
    editableScalar: ElementData | null;
    fullScreenDeterminant: boolean;
    // Estados de operações:
    operationHappening: boolean;
    editableOperatorNumber: ElementData | null;
    solutionType: SystemSolutionType | null;
    fullEquation: FullEquationData | null;
    viewReduced: boolean;
    // Estados de botões
    secondSetOfKeysActive: boolean;
    isRActive: boolean;
    columnDirectionActive: boolean;
    isVariableKeyboardActive: boolean;
    selectedOperator: Operator | null;
    // ---- useMemos: ----
    isNumberKeyboardActive: boolean;
    matrixOnScreen: MatrixData;
    isMatrixSquare: boolean;
    isMatrixFull: boolean;
    isInverseEnabled: boolean;
    isCheckActive: boolean;
    shouldACAppear: boolean;
    // ---- useCallbacks: ----
    undoHistory(): void;
    redoHistory(): void;
    clearHistory(): void;
    changeNumberWritten(params: ChangeNumberWrittenParams): void;
    changeEditableDimensions(params: MatrixDimensions): void;
    changeSelectedMatrixElement(selectedElement: SelectedMatrixElement): void;
    changeColumnDirectionActive(): void;
    changeSecondSetOfKeysActive(): void;
    changeViewReduced(): void;
    changeFullScreenDeterminant(): void;
    changeIsVariableKeyboardActive(): void;
    onPressInfoAreaBackground(): void;
    onPressNumberButton(element: number | string): void;
    onPressAC(): void;
    onPressCE(): void;
    onPressAddMatrix(): void;
    onPressSubtractMatrix(): void;
    onPressAxB(): void;
    onPressBxA(): void;
    onPressLambdaxA(): void;
    onPressOperator(operator: Operator): void;
    onPressR(): void;
    onPressResolveEquation(newState: CalcState): void;
    onPressGaussianElimination(): void; 
    onPressGaussianEliminationReduced(): void; 
    onTranspose(): void;
    onInvert(): void;
    onEnter(): void;
    onCheck(): void;
}

const INITIAL_MATRIX = MatrixOperations.emptyMatrix({
    rows: 3,
    columns: 1,
});

const CalculatorContext = createContext<CalculatorContextData>({} as CalculatorContextData);

export const CalculatorProvider: React.FC = ({ children }) => {
    // Estado geral da Calculadora:
    const [calcState, setCalcState] = useState(CalcState.editing);

    // Estados de matrizes:
    const [readyMatrix, _setReadyMatrix] = useState(INITIAL_MATRIX);
    const [editableMatrix, setEditableMatrix] = useState(INITIAL_MATRIX);
    const [matrixHistory, setMatrixHistory] = useState({
        history: [MatrixOperations.copyMatrixData(INITIAL_MATRIX)],
        currentPosition: 0
    });
    const [selectedMatrixElement, setSelectedMatrixElement] = useState<SelectedMatrixElement | null>({
        row: 0,
        column: 0,
    });
    const [shouldUserInputOverwriteElement, setShouldUserInputOverwriteElement] = useState(true);
    const [editableDimensions, setEditableDimensions] = useState(INITIAL_MATRIX.dimensions());

    // Estados de escalares:
    const [editableScalar, setEditableScalar] = useState<ElementData | null>(null);
    const [fullScreenDeterminant, setFullScreenDeterminant] = useState(false);

    // Estados de operações:
    const [operationHappening, setOperationHappening] = useState(false);
    const [editableOperatorNumber, setEditableOperatorNumber] = useState<ElementData | null>(null);
    const [solutionType, setSolutionType] = useState<SystemSolutionType | null>(null);
    const [fullEquation, setFullEquation] = useState<FullEquationData | null>(null);
    const [viewReduced, setViewReduced] = useState(false);

    // Estados de botões:
    const [secondSetOfKeysActive, setSecondSetOfKeysActive] = useState(false);
    const [isRActive, setIsRActive] = useState(false);
    const [columnDirectionActive, setColumnDirectionActive] = useState(true);
    const [isVariableKeyboardActive, setIsVariableKeyboardActive] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

    const setReadyMatrix = useCallback(
        (newMatrix: MatrixData) => {

            _setReadyMatrix(newMatrix);

            const { currentPosition } = matrixHistory;

            const newHistory = [...matrixHistory.history].slice(0, currentPosition + 1);

            if (!MatrixOperations.compareMatrices(newMatrix, newHistory[newHistory.length - 1]))
                setMatrixHistory({
                    history: [ ...newHistory, MatrixOperations.copyMatrixData(newMatrix) ],
                    currentPosition: currentPosition + 1
                });

        }, [matrixHistory, _setReadyMatrix, setMatrixHistory]
    );

    const isNumberKeyboardActive = useMemo(
        () => !!selectedMatrixElement || calcState === CalcState.LambdaxA,
        [calcState, selectedMatrixElement]
    );

    const matrixOnScreen = useMemo(
        () => calcState === CalcState.ready
            ? readyMatrix
            : editableMatrix,
        [calcState, readyMatrix, editableMatrix]
    );

    const changeMatrixOnScreen = useMemo(
        () => (
            (newMatrix: MatrixData) => (
                calcState === CalcState.ready
                    ? setReadyMatrix(newMatrix)
                    : setEditableMatrix(newMatrix)
            )
        ),
        [calcState, setReadyMatrix, setEditableMatrix]
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
            && MatrixOperations.determinant(matrixOnScreen).scalar !== 0,
        [matrixOnScreen]
    );

    const isEditableScalarReady = useMemo(
        () => !editableScalar?.stringify().toString().endsWith('.'),
        [editableScalar]
    );

    const isCheckActive = useMemo(
        () => calcState !== CalcState.LambdaxA
            ? MatrixOperations.isMatrixFull(matrixOnScreen)
            : isEditableScalarReady,
        [calcState, matrixOnScreen, isEditableScalarReady]
    );

    const isAFirst = useMemo(
        () => {
            return ![
                CalcState.BxA,
                CalcState.BxXeA,
                CalcState.XxBeA,
            ].includes(calcState);
        }, [calcState]
    );

    const clearHistory = useCallback(
        () => setMatrixHistory(
            {
                history: [MatrixOperations.copyMatrixData(matrixOnScreen)],
                currentPosition: 0
            }
        ), [matrixOnScreen, _setReadyMatrix, setMatrixHistory]
    );

    const undoHistory = useCallback(
        () => {

            const { history, currentPosition } = matrixHistory;

            setMatrixHistory(
                {
                    history,
                    currentPosition: currentPosition - 1
                }
            );
            
            _setReadyMatrix(
                MatrixOperations.copyMatrixData(history[currentPosition - 1])
            );

        }, [matrixHistory, _setReadyMatrix, setMatrixHistory]
    );

    const redoHistory = useCallback(
        () => {

            const { history, currentPosition } = matrixHistory;

            setMatrixHistory(
                {
                    history,
                    currentPosition: currentPosition + 1
                }
            );
            
            _setReadyMatrix(
                MatrixOperations.copyMatrixData(history[currentPosition + 1])
            );

        }, [matrixHistory, _setReadyMatrix, setMatrixHistory]
    );

    const getNumberWritten = useCallback(
        (forceNotOperatorNumber: boolean, doNotStringify: boolean): ElementData | string | null => {

            if (operationHappening && !forceNotOperatorNumber)
                return editableOperatorNumber === null && !doNotStringify
                    ? '' as string
                    : editableOperatorNumber;

            const { row, column } = selectedMatrixElement || {} as SelectedMatrixElement;
            const matrixNumber = calcState === CalcState.LambdaxA
                ? editableScalar
                : editableMatrix?.data[row]
                && editableMatrix.data[row][column];

            if (
                (
                    shouldUserInputOverwriteElement
                    || (
                        matrixNumber instanceof ElementData
                        && matrixNumber.scalar === 0
                        && !matrixNumber.unfilteredString
                    )
                ) && !forceNotOperatorNumber
            )
                return doNotStringify ? null : '';

            return doNotStringify
                ? matrixNumber as ElementData
                : (matrixNumber as ElementData)?.commaStringify({ dontFindFraction: true });

        }, [calcState, editableMatrix, shouldUserInputOverwriteElement, editableScalar, operationHappening, selectedMatrixElement, editableOperatorNumber]
    );

    const stringifiedNumberWritten = useMemo(
        () => getNumberWritten(false, false) as string,
        [getNumberWritten]
    );

    const elementDataNumberWritten = useMemo(
        () => getNumberWritten(false, true) as ElementData,
        [getNumberWritten]
    );

    const notOperatorNumberWritten = useMemo(
        () => getNumberWritten(true, true) as ElementData,
        [getNumberWritten]
    );

    const shouldACAppear = useMemo(
        () => (
            elementDataNumberWritten?.scalar === 0 
            || calcState === CalcState.ready
        ),
        [elementDataNumberWritten, calcState]
    );

    const changeNumberWritten = useCallback(
        (
            { 
                newNumber, 
                forceNotOperatorNumber = false 
            }: ChangeNumberWrittenParams
        ) => {

            if (operationHappening && !forceNotOperatorNumber)
                setEditableOperatorNumber(newNumber);

            else if (calcState === CalcState.LambdaxA)
                setEditableScalar(newNumber);

            else
                setEditableMatrix(MatrixOperations.changeElement({
                    matrix: editableMatrix || readyMatrix,
                    ...(selectedMatrixElement as SelectedMatrixElement),
                    numberWritten: newNumber
                }));

        }, 
        [
            calcState,
            readyMatrix,
            editableMatrix,
            selectedMatrixElement,
            operationHappening,
            setEditableOperatorNumber,
            setEditableScalar,
            setEditableMatrix
        ]
    );

    const changeViewReduced = useCallback(
        () => setViewReduced(!viewReduced),
        [viewReduced, setViewReduced]
    );

    const changeFullScreenDeterminant = useCallback(
        () => setFullScreenDeterminant(!fullScreenDeterminant),
        [fullScreenDeterminant, setFullScreenDeterminant]
    );

    const changeIsVariableKeyboardActive = useCallback(
        () => setIsVariableKeyboardActive(!isVariableKeyboardActive),
        [isVariableKeyboardActive, setIsVariableKeyboardActive]
    );

    const onPressNumberButton = useCallback(
        (element: string) => {

            const originalValue = elementDataNumberWritten;

            if (element.match(/^[a-i]+$/))
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

            else if (stringifiedNumberWritten.length === 0 && element === '.')
                changeNumberWritten({
                    newNumber: new ElementData({
                        unfilteredString: '0.'
                    })
                });

            else if (count(stringifiedNumberWritten, /\.|,/, true) === 0 || element !== '.') {

                changeNumberWritten({
                    newNumber: new ElementData({
                        scalar: originalValue === null
                            ? element
                            : !!originalValue.unfilteredString 
                                ? (originalValue.unfilteredString as string) + element
                                : originalValue.variables.length === 0 || originalValue.scalar !== 1
                                    ? originalValue.scalar.toString() + element
                                    : element,
                        variables: (originalValue !== null && originalValue.variables) || []
                    })
                });
            }

            setShouldUserInputOverwriteElement(false);

        }, [elementDataNumberWritten, stringifiedNumberWritten, selectedMatrixElement, getNumberWritten, changeNumberWritten]
    );

    const changeSettingsOfSelectedMatrixElement = useCallback(
        (selectedElement) => {
            setShouldUserInputOverwriteElement(true);
            setSelectedMatrixElement(selectedElement);
        }, [setShouldUserInputOverwriteElement, setSelectedMatrixElement]
    );

    const resetScalarOperations = useCallback(
        () => {
            setEditableOperatorNumber(null);
            setOperationHappening(false);
            setSelectedOperator(null);
        }, [setEditableOperatorNumber, setOperationHappening, setSelectedOperator]
    );

    const applyOperation = useCallback(
        () => {
            resetScalarOperations();

            if (editableOperatorNumber !== null)
                changeNumberWritten({
                    newNumber: varOperation(
                        notOperatorNumberWritten,
                        selectedOperator,
                        editableOperatorNumber
                    ),
                    forceNotOperatorNumber: true,
                });
        }, [editableOperatorNumber, notOperatorNumberWritten, selectedOperator, resetScalarOperations, changeNumberWritten, getNumberWritten]
    );

    const enterEditingMode = useCallback(
        ({ newEditableMatrix, newCalcState, newSelectedElement = undefined, newScalar }) => {
            setCalcState(newCalcState);

            setFullEquation(null);
            setEditableMatrix(newEditableMatrix)
            setEditableDimensions(newEditableMatrix ? newEditableMatrix.dimensions() : null);

            setSolutionType(null);

            setEditableScalar(newScalar);

            newSelectedElement !== undefined && changeSettingsOfSelectedMatrixElement(newSelectedElement);
        },
        [
            setCalcState,
            setFullEquation,
            setEditableMatrix,
            setEditableDimensions,
            setSolutionType,
            setEditableScalar,
            changeSettingsOfSelectedMatrixElement
        ]
    );

    const changeSelectedMatrixElement = useCallback(
        (selectedElement) => {

            operationHappening && applyOperation();

            changeSettingsOfSelectedMatrixElement(selectedElement);

            if (calcState === CalcState.ready) {
                enterEditingMode({
                    newCalcState: CalcState.editing,
                    newEditableMatrix: readyMatrix,
                    newSelectedElement: selectedElement
                });
            }
        }, [calcState, readyMatrix, operationHappening, applyOperation, changeSettingsOfSelectedMatrixElement, enterEditingMode]
    );


    const changeColumnDirectionActive = useCallback(
        () => setColumnDirectionActive(!columnDirectionActive),
        [columnDirectionActive, setColumnDirectionActive]
    );

    const changeSecondSetOfKeysActive = useCallback(
        () => setSecondSetOfKeysActive(!secondSetOfKeysActive),
        [secondSetOfKeysActive, setSecondSetOfKeysActive]
    )

    const exitEditingMode = useCallback(
        () => setCalcState(CalcState.ready),
        [setCalcState]
    );

    const nextElement = useCallback(
        () => {
            const { row, column } = selectedMatrixElement as SelectedMatrixElement;
            const maxRows = editableMatrix.dimensions().rows;
            const maxColumns = editableMatrix.dimensions().columns;

            let selectedElement = {} as SelectedMatrixElement | null;

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
        }, [selectedMatrixElement, editableMatrix, columnDirectionActive, changeSettingsOfSelectedMatrixElement]
    );

    const solveOperationsFullEquationSetup = useCallback(
        () => {

            const {
                partiallyEliminatedOriginal,
                solution,
                systemSolutionsType,
            } = MatrixOperations.findSolutionForMatrixEquation(
                isAFirst ? readyMatrix : editableMatrix,
                isAFirst ? editableMatrix : readyMatrix,
                [
                    CalcState.XxAeB,
                    CalcState.XxBeA,
                ].includes(calcState),
            );

            setViewReduced(false);
            setFullEquation({
                equationType: calcState,
                solutionType: systemSolutionsType,
                matrixA: readyMatrix,
                matrixB: editableMatrix,
                matrixC: solution,
                matrixD: partiallyEliminatedOriginal
            });
            setSolutionType(systemSolutionsType);

            setReadyMatrix(
                systemSolutionsType == SystemSolutionType.SPD
                    ? solution
                    : readyMatrix
            );

        }, [isAFirst, calcState, readyMatrix, editableMatrix, setViewReduced, setFullEquation, setSolutionType, setReadyMatrix]
    );

    const singleInputFullEquationSetup = useCallback(
        (matrixOperation) => {
            const oldMatrix = matrixOnScreen;

            const newMatrix = matrixOperation === CalcState.transpose
                ? MatrixOperations.transpose(oldMatrix)
                : MatrixOperations.invert(oldMatrix);

            setFullEquation({
                equationType: matrixOperation,
                matrixA: oldMatrix,
                matrixB: newMatrix
            } as FullEquationData);

        }, [matrixOnScreen, setFullEquation]
    );

    const scalarFullEquationSetup = useCallback(
        ({ newMatrix, scalar }) => {
            setReadyMatrix(newMatrix);

            setFullEquation({
                equationType: calcState,
                matrixB: readyMatrix,
                matrixC: newMatrix,
                scalar
            });
        }, [calcState, readyMatrix, setReadyMatrix, setFullEquation]
    );

    const generalFullEquationSetup = useCallback(
        ({ newMatrix }) => {
            setReadyMatrix(newMatrix);

            setFullEquation({
                equationType: calcState,
                matrixA: isAFirst ? readyMatrix : editableMatrix,
                matrixB: isAFirst ? editableMatrix : readyMatrix,
                matrixC: newMatrix,
            });
        }, [calcState, readyMatrix, editableMatrix, isAFirst, setReadyMatrix, setFullEquation]
    );

    const onPressInfoAreaBackground = useCallback(
        () => {

            if (fullScreenDeterminant)
                setFullScreenDeterminant(false);

            else {
                operationHappening && applyOperation();

                if (calcState !== CalcState.LambdaxA) {
                    setCalcState(CalcState.ready);
                    calcState === CalcState.editing
                        && setReadyMatrix(editableMatrix);
                    changeSettingsOfSelectedMatrixElement(null);
                }
            }
        },
        [
            calcState,
            editableMatrix,
            fullScreenDeterminant,
            operationHappening,
            setFullScreenDeterminant,
            applyOperation,
            setCalcState,
            setReadyMatrix,
            changeSettingsOfSelectedMatrixElement
        ]
    );

    const changeEditableDimensions = useCallback(
        ({ rows, columns }: MatrixDimensions) => {
            setEditableDimensions({ rows, columns });
            setEditableMatrix(
                MatrixOperations.resizeMatrix({
                    originalMatrix: calcState === CalcState.editing
                        ? readyMatrix
                        : editableMatrix,
                    editableMatrix: editableMatrix,
                    rows,
                    columns,
                })
            );
            setSelectedMatrixElement(
                selectedMatrixElement?.row || 0 >= rows
                    || selectedMatrixElement?.column || 0 >= columns
                    ? null
                    : selectedMatrixElement
            );
        },
        [
            calcState,
            readyMatrix,
            editableMatrix,
            selectedMatrixElement,
            setEditableDimensions,
            setEditableMatrix,
            setSelectedMatrixElement,
        ]
    );

    const onPressAC = useCallback(
        () => {
            resetScalarOperations();

            if (calcState !== CalcState.LambdaxA) {

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
        },
        [
            calcState,
            matrixOnScreen,
            changeMatrixOnScreen,
            resetScalarOperations,
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
            operationHappening && applyOperation();
            setOperationHappening(true);
            setEditableOperatorNumber(null);
            setSelectedOperator(operator);
        }, [operationHappening, applyOperation, setOperationHappening, setEditableOperatorNumber, setSelectedOperator]
    );

    const onPressAxB = useCallback(
        () => {
            setReadyMatrix(
                calcState !== CalcState.ready
                    ? editableMatrix
                    : readyMatrix
            );

            enterEditingMode({
                newCalcState: CalcState.AxB,
                newEditableMatrix: MatrixOperations.emptyMatrix(
                    MatrixOperations.getTransposedDimensions(matrixOnScreen)
                ),
                newSelectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [calcState, readyMatrix, editableMatrix, matrixOnScreen, setReadyMatrix, enterEditingMode]
    );

    const onPressBxA = useCallback(
        () => {
            setReadyMatrix(
                calcState !== CalcState.ready
                    ? editableMatrix
                    : readyMatrix
            );

            enterEditingMode({
                newCalcState: CalcState.BxA,
                newEditableMatrix: MatrixOperations.emptyMatrix(
                    MatrixOperations.getTransposedDimensions(matrixOnScreen)
                ),
                newSelectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [calcState, readyMatrix, editableMatrix, matrixOnScreen, setReadyMatrix, enterEditingMode]
    );

    const onPressLambdaxA = useCallback(
        () => {
            setReadyMatrix(
                calcState !== CalcState.ready
                    ? editableMatrix
                    : readyMatrix
            );

            enterEditingMode({
                newCalcState: CalcState.LambdaxA,
                newEditableMatrix: null,
                newSelectedElement: null,
                newScalar: new ElementData({
                    scalar: 0
                }),
            });

        }, [calcState, readyMatrix, editableMatrix, setReadyMatrix, enterEditingMode]
    );

    const onPressAddMatrix = useCallback(
        () => {
            setReadyMatrix(
                calcState !== CalcState.ready
                    ? editableMatrix
                    : readyMatrix
            );

            enterEditingMode({
                newCalcState: CalcState.addMatrix,
                newEditableMatrix: MatrixOperations.emptyMatrix(matrixOnScreen.dimensions()),
                newSelectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [calcState, readyMatrix, editableMatrix, matrixOnScreen, setReadyMatrix, enterEditingMode]
    );

    const onPressSubtractMatrix = useCallback(
        () => {
            setReadyMatrix(
                calcState !== CalcState.ready
                    ? editableMatrix
                    : readyMatrix
            );

            enterEditingMode({
                newCalcState: CalcState.subtractMatrix,
                newEditableMatrix: MatrixOperations.emptyMatrix(matrixOnScreen.dimensions()),
                newSelectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        }, [calcState, readyMatrix, editableMatrix, matrixOnScreen, setReadyMatrix, enterEditingMode]
    );

    const onPressR = useCallback(
        () => setIsRActive(!isRActive),
        [isRActive, setIsRActive]
    );

    const onPressResolveEquation = useCallback(
        (newState: CalcState) => {
            setIsRActive(!isRActive);

            setReadyMatrix(
                calcState !== CalcState.ready
                    ? editableMatrix
                    : readyMatrix
            );

            enterEditingMode({
                newCalcState: newState,
                newEditableMatrix: MatrixOperations.emptyMatrix(matrixOnScreen.dimensions()),
                newSelectedElement: {
                    row: 0,
                    column: 0,
                },
            });
        },
        [
            calcState,
            readyMatrix,
            editableMatrix,
            isRActive,
            matrixOnScreen,
            setIsRActive, 
            setReadyMatrix, 
            enterEditingMode
        ]
    );

    const onPressGaussianElimination = useCallback(
        () => {

            const {
                rowEchelonForm,
                reducedRowEchelonForm
            } = MatrixOperations.getGaussianElimination(matrixOnScreen);

            setViewReduced(false);
            setFullEquation({
                equationType: CalcState.gaussianElimination,
                matrixA: matrixOnScreen,
                matrixC: rowEchelonForm,
                matrixD: reducedRowEchelonForm
            });

            setReadyMatrix(rowEchelonForm);

        }, [matrixOnScreen, setViewReduced, setFullEquation, setReadyMatrix]
    );

    const onPressGaussianEliminationReduced = useCallback(
        () => {
            changeViewReduced();
            setReadyMatrix((viewReduced ? (fullEquation as FullEquationData).matrixC : (fullEquation as FullEquationData).matrixD) as MatrixData);
        },
        [viewReduced, fullEquation, changeViewReduced, setReadyMatrix]
    );

    const onTranspose = useCallback(
        () => {

            if (calcState === CalcState.ready)
                setReadyMatrix(MatrixOperations.transpose(readyMatrix));

            else {
                setEditableMatrix(MatrixOperations.transpose(editableMatrix));
                setEditableDimensions({
                    rows: editableDimensions.columns,
                    columns: editableDimensions.rows,
                });

                changeSettingsOfSelectedMatrixElement({
                    row: selectedMatrixElement?.column,
                    column: selectedMatrixElement?.row,
                });
            }

            singleInputFullEquationSetup(CalcState.transpose);

        },
        [
            calcState,
            readyMatrix,
            editableMatrix,
            selectedMatrixElement,
            editableDimensions,
            setReadyMatrix, 
            setEditableMatrix, 
            setEditableDimensions, 
            changeSettingsOfSelectedMatrixElement,
            singleInputFullEquationSetup
        ]
    );

    const onInvert = useCallback(
        () => {

            try {

                if (calcState === CalcState.ready) {
                    setReadyMatrix(MatrixOperations.invert(readyMatrix));
                }

                else {
                    setEditableMatrix(MatrixOperations.invert(readyMatrix));
                    changeSettingsOfSelectedMatrixElement(null);
                    exitEditingMode();
                }

                singleInputFullEquationSetup(CalcState.invert);

            } catch (e) {
                console.log(e);
            }

        },
        [
            calcState,
            readyMatrix,
            editableMatrix,
            setReadyMatrix, 
            setEditableMatrix, 
            changeSettingsOfSelectedMatrixElement,
            exitEditingMode,
            singleInputFullEquationSetup
        ]
    );

    const onEnter = useCallback(
        () => {
            operationHappening && applyOperation();
            selectedMatrixElement && nextElement();
        }, [operationHappening, selectedMatrixElement, applyOperation, nextElement]
    );

    const onCheck = useCallback(
        () => {
            switch (calcState) {
                case CalcState.editing:
                    setReadyMatrix(editableMatrix);
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
                            scalar: editableScalar,
                        }),
                        scalar: editableScalar,
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
        },
        [
            calcState,
            readyMatrix,
            editableMatrix,
            editableScalar,
            setReadyMatrix, 
            generalFullEquationSetup,
            scalarFullEquationSetup, 
            solveOperationsFullEquationSetup,
            exitEditingMode
        ]
    );

    return (
        <CalculatorContext.Provider
            value={{
                // ---- useStates: ----
                // Estado geral da calculadora:
                calcState,
                // Estados de matrizes:
                readyMatrix,
                editableMatrix,
                matrixHistory,
                selectedMatrixElement,
                shouldUserInputOverwriteElement,
                editableDimensions,
                // Estados de escalares:
                editableScalar,
                fullScreenDeterminant,
                // Estados de operações:
                operationHappening,
                editableOperatorNumber,
                solutionType,
                fullEquation,
                viewReduced,
                // Estados de botões
                secondSetOfKeysActive,
                isRActive,
                columnDirectionActive,
                isVariableKeyboardActive,
                selectedOperator,
                // ---- useMemos: ----
                isNumberKeyboardActive,
                matrixOnScreen,
                isMatrixSquare,
                isMatrixFull,
                isInverseEnabled,
                isCheckActive,
                shouldACAppear,
                // ---- useCallbacks: ----
                undoHistory,
                redoHistory,
                clearHistory,
                changeNumberWritten,
                changeEditableDimensions,
                changeSelectedMatrixElement,
                changeColumnDirectionActive,
                changeSecondSetOfKeysActive,
                changeViewReduced,
                changeFullScreenDeterminant,
                changeIsVariableKeyboardActive,
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
                onPressGaussianElimination, 
                onPressGaussianEliminationReduced, 
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
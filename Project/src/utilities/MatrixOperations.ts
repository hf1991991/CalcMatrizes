import MatrixData from "./MatrixData";
import { smartToFixed, SystemSolutionType, Operator } from "./constants";
import ScalarOperations from "./ScalarOperations";
import * as ExpressionSimplification from "./ExpressionSimplification";
import { createMatrixElement, ElementData, ExpressionData, VariableData } from "./ExpressionClasses";
import ElementDataWithPosition from "../interfaces/ElementDataWithPosition";
import MatrixColumnWithPosition from "../interfaces/MatrixColumnWithPosition";
import SelectedMatrixElement from "../interfaces/SelectedMatrixElement";
import MatrixColumnData from "../interfaces/MatrixColumnData";
import MatrixDimensions from "../interfaces/MatrixDimensions";
import addErrorTreatment from "./addErrorTreatment";

interface ChangeElementParams extends SelectedMatrixElement {
    matrix: MatrixData;
    numberWritten: ExpressionData;
}

interface JoinEditableAndOriginalMatricesParams extends MatrixDimensions {
    originalMatrix: MatrixData;
    editableMatrix: MatrixData;
}

interface MultiplyMatrixByScalarParams {
    matrixA: MatrixData;
    scalar: ExpressionData;
}

interface PartialGaussianEliminationParams {
    matrixA: MatrixData;
    matrixB: MatrixData;
    eliminateBelowMainDiagonal?: boolean;
}

interface FindSolutionMatrixEquationData {
    partiallyEliminatedOriginal: MatrixData;
    solution: MatrixData;
    systemSolutionsType: SystemSolutionType;
    solutionWithIndependentVariables: MatrixData | undefined;
    lettersUsed: Array<string> | undefined;
}

interface GetGaussianEliminationData {
    rowEchelonForm: MatrixData;
    reducedRowEchelonForm: MatrixData;
}

interface PartialGaussianEliminationData {
    matrixA: MatrixData;
    matrixB: MatrixData;
    determinant: ExpressionData;
}

interface TransformEquationToVectorFormData {
    matrixA: MatrixData;
    vectorizedX: Array<ExpressionData>;
    vectorizedB: Array<ExpressionData>;
}

class MatrixOperations {

    static changeElement({ matrix, column, row, numberWritten }: ChangeElementParams) {
        let matrixDataCopy = [...matrix.data];
        matrixDataCopy[row][column] = numberWritten;
        return new MatrixData(matrixDataCopy);
    }

    static insertElementsPosition(matrix: MatrixData): Array<MatrixColumnWithPosition> {
        let positionMatrix: Array<MatrixColumnWithPosition> = [];

        if (!matrix) return positionMatrix;

        for (let column = matrix.dimensions().columns - 1; column >= 0; column--) {
            let positionMatrixColumn: Array<ElementDataWithPosition> = [];
            for (let row = matrix.dimensions().rows - 1; row >= 0; row--) {
                positionMatrixColumn.push({
                    number: matrix.data[row][column],
                    row,
                    column,
                });
            }
            positionMatrix.push({
                data: positionMatrixColumn,
                column,
            });
        }

        return positionMatrix;
    }

    static copyMatrixData(matrix: MatrixData) {
        let copyData = [];

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            let copyDataRow = [];
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                copyDataRow.push(matrix.data[row][column]);
            }
            copyData.push(copyDataRow);
        }

        return new MatrixData(copyData);
    }

    static minDimensions = (matrix1: MatrixData, matrix2: MatrixData) => ({
        rows: Math.min(matrix1.dimensions().rows, matrix2.dimensions().rows),
        columns: Math.min(matrix1.dimensions().columns, matrix2.dimensions().columns),
    })

    static maxDimensions = (matrix1: MatrixData, matrix2: MatrixData) => ({
        rows: Math.max(matrix1.dimensions().rows, matrix2.dimensions().rows),
        columns: Math.max(matrix1.dimensions().columns, matrix2.dimensions().columns),
    })

    static joinElements = (matrix1: MatrixData, matrix2: MatrixData, row: number, column: number) => {
        const joinedElement =
            (matrix1.data[row] && matrix1.data[row][column])
            || (
                !matrix1.hasPosition({ row, column })
                && matrix2.data[row]
                && matrix2.data[row][column]
            )
            || 0;
        return joinedElement === undefined ? 0 : joinedElement;
    }

    static joinEditableAndOriginalMatrices({ originalMatrix, editableMatrix, rows, columns }: JoinEditableAndOriginalMatricesParams) {
        let joined = [];

        for (let row = 0; row < rows; row++) {
            let fixedRow = [];
            for (let column = 0; column < columns; column++) {
                const joinedElement = MatrixOperations.joinElements(editableMatrix, originalMatrix, row, column);
                fixedRow.push(joinedElement);
            }
            joined.push(fixedRow);
        }

        return joined;
    }

    static resizeMatrix({ originalMatrix, editableMatrix, rows, columns }: JoinEditableAndOriginalMatricesParams) {
        return new MatrixData(
            MatrixOperations.joinEditableAndOriginalMatrices({
                originalMatrix,
                editableMatrix,
                rows,
                columns
            })
        );
    }

    static getTransposedDimensions(matrix: MatrixData) {
        return MatrixOperations.transpose(matrix).dimensions();
    }

    static compareMatrices(matrix1: MatrixData, matrix2: MatrixData) {
        if (
            matrix1.dimensions().rows !== matrix2.dimensions().rows
            || matrix1.dimensions().columns !== matrix2.dimensions().columns
        ) return false;

        for (let row = 0; row < matrix1.dimensions().rows; row++) {
            for (let column = 0; column < matrix1.dimensions().columns; column++) {
                if (
                    matrix1.data[row][column]?.commaStringify() !== matrix2.data[row][column]?.commaStringify()
                ) return false;
            }
        }
        return true;
    }

    static isMatrixFull(matrix: MatrixData) {
        if (!matrix) return false;

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                if (Number.isNaN(matrix.data[row][column])) return false;
            }
        }
        return true;
    }

    static isMatrixEmpty(matrix: MatrixData) {
        if (!matrix) return false;

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                if (matrix.data[row][column]?.commaStringify() !== '0') return false;
            }
        }
        return true;
    }

    static isMatrixSquare(matrix: MatrixData) {
        return matrix && matrix.dimensions().rows === matrix.dimensions().columns;
    }

    static printMatrix(matrix: MatrixData) {
        for (let row of matrix.data) {
            let rowString = '';
            for (let elem of row) {
                rowString += ` ${elem.stringify()} `;
            }
            console.log(rowString);
        }
        console.log('\n');
    }

    // static smartToFixedOnMatrix(matrixData) {
    //     let fixed = [];

    //     for (let row = 0; row < matrixData.length; row++) {
    //         let fixedRow = [];
    //         for (let column = 0; column < matrixData[0].length; column++) {
    //             fixedRow.push(smartToFixed(matrixData[row][column]));
    //         }
    //         fixed.push(fixedRow);
    //     }

    //     return fixed;
    // }

    static applyFrescuresToMatrixData(matrixData: Array<Array<ExpressionData | number>>): Array<MatrixColumnData> {
        if (!matrixData) return [];

        let converted = [];

        for (let row = 0; row < matrixData.length; row++) {
            let convertedRow = [];
            for (let column = 0; column < matrixData[0].length; column++) {
                let element = matrixData[row][column];

                if (!(element instanceof ExpressionData)) {
                    // console.log('applyFrescuresToMatrixData: elemento não é um ElementData: ' + element);
                    element = createMatrixElement({
                        scalar: element
                    });
                }

                // if (!element.unfilteredString)
                //     element = Number.parseFloat(element.scalar)

                convertedRow.push(element);
            }
            converted.push(convertedRow);
        }

        return converted;
    }

    static emptyMatrix({ rows, columns }: MatrixDimensions) {
        let matrix = [];

        for (let row = 0; row < rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < columns; column++) {
                matrixRow.push(0);
            }
            matrix.push(matrixRow);
        }

        return new MatrixData(matrix);
    }

    static identity(dimension: number) {
        let identity = [];

        for (let row = 0; row < dimension; row++) {
            let identityRow = [];
            for (let column = 0; column < dimension; column++) {
                identityRow.push(row === column ? 1 : 0);
            }
            identity.push(identityRow);
        }

        return new MatrixData(identity);
    }

    static sum(matrixA: MatrixData, matrixB: MatrixData) {
        let matrix = [];

        for (let row = 0; row < matrixA.dimensions().rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < matrixA.dimensions().columns; column++) {
                matrixRow.push(
                    ExpressionSimplification.varOperation(
                        matrixA.data[row][column],
                        Operator.Add,
                        matrixB.data[row][column]
                    )
                );
            }
            matrix.push(matrixRow);
        }

        return new MatrixData(matrix);
    }

    static subtract(matrixA: MatrixData, matrixB: MatrixData) {
        let matrix = [];

        for (let row = 0; row < matrixA.dimensions().rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < matrixA.dimensions().columns; column++) {
                matrixRow.push(
                    ExpressionSimplification.varOperation(
                        matrixA.data[row][column],
                        Operator.Subtract,
                        matrixB.data[row][column]
                    )
                );
            }
            matrix.push(matrixRow);
        }

        return new MatrixData(matrix);
    }

    static multiplyMatrix(matrixA: MatrixData, matrixB: MatrixData) {
        let matrix = [];

        for (let row = 0; row < matrixA.dimensions().rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < matrixB.dimensions().columns; column++) {
                let newElement = createMatrixElement({
                    scalar: 0,
                });
                for (let index = 0; index < matrixA.dimensions().columns; index++) {

                    newElement = ExpressionSimplification.varOperation(
                        ExpressionSimplification.varOperation(
                            matrixA.data[row][index],
                            Operator.Multiply,
                            matrixB.data[index][column]
                        ),
                        Operator.Add,
                        newElement
                    );

                }
                matrixRow.push(newElement);
            }
            matrix.push(matrixRow);
        }

        return new MatrixData(matrix);
    }

    static multiplyMatrixByScalar({ matrixA, scalar }: MultiplyMatrixByScalarParams) {
        let matrix = [];

        for (let row = 0; row < matrixA.dimensions().rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < matrixA.dimensions().columns; column++) {
                matrixRow.push(
                    ExpressionSimplification.varOperation(
                        matrixA.data[row][column],
                        Operator.Multiply,
                        scalar
                    )
                );
            }
            matrix.push(matrixRow);
        }

        return new MatrixData(matrix);
    }

    static transpose(matrix: MatrixData) {
        let transposedData = [];

        for (let column = 0; column < matrix.dimensions().columns; column++) {
            let transposedRow = [];
            for (let row = 0; row < matrix.dimensions().rows; row++) {
                transposedRow.push(matrix.data[row][column]);
            }
            transposedData.push(transposedRow);
        }

        return new MatrixData(transposedData);
    }

    static invert(matrix: MatrixData) {
        function _invert() {
            console.log('STARTING BELOW MAIN DIAGONAL')
            let firstElimination = MatrixOperations.partialGaussianElimination({
                matrixA: matrix,
                matrixB: MatrixOperations.identity(matrix.dimensions().rows),
                eliminateBelowMainDiagonal: true,
            });
            console.log('ENDED BELOW MAIN DIAGONAL')

            MatrixOperations.printMatrix(firstElimination.matrixA)
            MatrixOperations.printMatrix(firstElimination.matrixB)

            console.log('STARTING ABOVE MAIN DIAGONAL')
            let secondElimination = MatrixOperations.partialGaussianElimination({
                ...firstElimination,
                eliminateBelowMainDiagonal: false,
            });
            console.log('ENDED ABOVE MAIN DIAGONAL')

            return MatrixOperations.copyMatrixData(secondElimination.matrixB);
        }

        return addErrorTreatment(_invert, 'inverted');
    }

    static determinant(matrix: MatrixData) {
        return addErrorTreatment(
            () => (
                MatrixOperations.partialGaussianElimination({
                    matrixA: matrix,
                    matrixB: MatrixOperations.identity(matrix.dimensions().rows)
                }).determinant
            ),
            'determinant'
        );
    }

    /* 
        Escalona a porcao, seja abaixo ou acima, da diagonal principal 
        de matrixA, assim como retorna o determinante da matriz.
        OBS: verticalElimination deve ser verdadeiro se a ordem da equação a ser escalonada é X*A=B.
    */
    static partialGaussianElimination({ matrixA, matrixB, eliminateBelowMainDiagonal = true }: PartialGaussianEliminationParams) {
        let _matrixA = MatrixOperations.copyMatrixData(matrixA);
        let _matrixB = MatrixOperations.copyMatrixData(matrixB);

        MatrixOperations.printMatrix(_matrixA);

        const dimensionsA = _matrixA.dimensions();
        const dimensionsB = _matrixB.dimensions();

        const minDimensionsA = Math.min(
            dimensionsA.rows,
            dimensionsA.columns,
        );

        let determinant = createMatrixElement({ scalar: 1 });
        let noPivotOnColumn = false;

        for (
            let pivotColumn = (eliminateBelowMainDiagonal ? 0 : minDimensionsA - 1);
            pivotColumn != (eliminateBelowMainDiagonal ? minDimensionsA : -1);
            pivotColumn += (eliminateBelowMainDiagonal ? 1 : -1)
        ) {
            let pivot = _matrixA.data[pivotColumn][pivotColumn];

            // Se estiver na eliminação acima da diagonal e 
            // encontrar um pivot zero, simplesmente pular para o próximo
            // (permite deixar da forma escalonada reduzida):
            if (eliminateBelowMainDiagonal || !pivot.isZero) {

                if (pivot.isZero) {

                    let testRow = pivotColumn + 1;
                    while (true) {
                        // Se houver uma coluna sem pivot em uma matriz escalonada reduzida, o determinante dela é nulo:
                        if (testRow === dimensionsA.columns) {
                            noPivotOnColumn = true;
                            break;
                        }

                        let possibleNewPivot = _matrixA.data[testRow][pivotColumn];

                        if (!possibleNewPivot.isZero) break;

                        testRow++;
                    }

                    if (!noPivotOnColumn) {
                        let _matrixACopy = MatrixOperations.copyMatrixData(_matrixA);
                        let _matrixBCopy = MatrixOperations.copyMatrixData(_matrixB);

                        _matrixA.data[pivotColumn] = _matrixACopy.data[testRow];
                        _matrixA.data[testRow] = _matrixACopy.data[pivotColumn];

                        _matrixB.data[pivotColumn] = _matrixBCopy.data[testRow];
                        _matrixB.data[testRow] = _matrixBCopy.data[pivotColumn];

                        pivot = _matrixA.data[pivotColumn][pivotColumn];

                        determinant = ExpressionSimplification.varOperation(determinant, Operator.Multiply, createMatrixElement({ scalar: -1 }));
                    }
                }

                if (!noPivotOnColumn) {

                    console.log({ pivot: pivot.stringify(), pivotColumn });

                    if (!pivot.isOne) {
                        for (let index = 0; index < dimensionsA.columns; index++)
                            _matrixA.data[pivotColumn][index] =
                                ExpressionSimplification.varOperation(_matrixA.data[pivotColumn][index], Operator.Divide, pivot);

                        console.log('STARTING MATRIX B DIVISION BY PIVOT')
                        for (let index = 0; index < dimensionsB.columns; index++)
                            _matrixB.data[pivotColumn][index] =
                                ExpressionSimplification.varOperation(_matrixB.data[pivotColumn][index], Operator.Divide, pivot);
                        console.log('ENDED MATRIX B DIVISION BY PIVOT')

                        determinant = ExpressionSimplification.varOperation(determinant, Operator.Multiply, pivot);

                        //if (showSteps)
                        //    exibicao_passos_resolver_equacao_matricial(_matrixA, _matrixB, pivot, pivotColumn+1, pivotColumn+1, verticalElimination, None)

                        pivot = _matrixA.data[pivotColumn][pivotColumn];
                    }

                    for (
                        let index = (eliminateBelowMainDiagonal
                            ? 0
                            : pivotColumn - 1
                        );
                        index != (eliminateBelowMainDiagonal
                            ? dimensionsA.rows - pivotColumn - 1
                            : -1
                        );
                        index += (eliminateBelowMainDiagonal
                            ? 1
                            : -1
                        )
                    ) {
                        let verticalIndex: number;
                        if (eliminateBelowMainDiagonal)
                            verticalIndex = index + pivotColumn + 1;
                        else
                            verticalIndex = index;

                        const element = _matrixA.data[verticalIndex][pivotColumn];
                        const eliminationFactor = ExpressionSimplification.varOperation(
                            ExpressionSimplification.varOperation(
                                element,
                                Operator.Multiply,
                                createMatrixElement({ scalar: -1 })
                            ),
                            Operator.Divide,
                            pivot,
                        );
                        MatrixOperations.printMatrix(_matrixA);

                        console.log({ element: element.stringify(), pivot: pivot.stringify(), eliminationFactor: eliminationFactor.stringify() })

                        for (let horizontalIndex = 0; horizontalIndex < dimensionsA.columns; horizontalIndex++) {
                            _matrixA.data[verticalIndex][horizontalIndex] = ExpressionSimplification.varOperation(
                                _matrixA.data[verticalIndex][horizontalIndex],
                                Operator.Add,
                                ExpressionSimplification.varOperation(
                                    eliminationFactor,
                                    Operator.Multiply,
                                    _matrixA.data[pivotColumn][horizontalIndex]
                                ),
                            );
                        }

                        console.log('STARTING MATRIX B MERGE ROWS')
                        for (let horizontalIndex = 0; horizontalIndex < dimensionsB.columns; horizontalIndex++)
                            _matrixB.data[verticalIndex][horizontalIndex] = ExpressionSimplification.varOperation(
                                _matrixB.data[verticalIndex][horizontalIndex],
                                Operator.Add,
                                ExpressionSimplification.varOperation(
                                    eliminationFactor,
                                    Operator.Multiply,
                                    _matrixB.data[pivotColumn][horizontalIndex]
                                ),
                            );
                        console.log('ENDED MATRIX B MERGE ROWS')

                        //if (showSteps)
                        //    exibicao_passos_resolver_equacao_matricial(_matrixA, _matrixB, eliminationFactor, pivotColumn+1, verticalIndex+1, verticalElimination, None)
                    }
                    MatrixOperations.printMatrix(_matrixA);
                }

            }

            else
                determinant = createMatrixElement({ scalar: 0 });

        }

        if (noPivotOnColumn) determinant = createMatrixElement({
            scalar: 0
        });

        console.log({ determinant })

        console.log({ determinantString: determinant.stringify() });

        return {
            matrixA: MatrixOperations.copyMatrixData(_matrixA),
            matrixB: MatrixOperations.copyMatrixData(_matrixB),
            determinant,
        };
        // return arredondamento_na_raca(determinant, 6);
    }


    static getGaussianElimination(matrix: MatrixData) {
        function _getGaussianElimination(): GetGaussianEliminationData {
            const { matrixA: rowEchelonForm } = MatrixOperations.partialGaussianElimination({
                matrixA: matrix,
                matrixB: MatrixOperations.emptyMatrix({
                    rows: matrix.dimensions().rows,
                    columns: 1,
                }),
                eliminateBelowMainDiagonal: true
            });

            const { matrixA: reducedRowEchelonForm } = MatrixOperations.partialGaussianElimination({
                matrixA: rowEchelonForm,
                matrixB: MatrixOperations.emptyMatrix({
                    rows: matrix.dimensions().rows,
                    columns: 1,
                }),
                eliminateBelowMainDiagonal: false
            });

            return {
                rowEchelonForm,
                reducedRowEchelonForm
            };
        }

        return addErrorTreatment(_getGaussianElimination, 'gaussianElimination');
    }


    /* 
        Resolve o sistema A * X = B, quando a incognita procede a matriz A conhecida, 
        ou o sistema X * A = B, quando a incognita precede a matriz A conhecida.
        OBS: verticalElimination deve ser verdadeiro se a ordem da equação a ser escalonada é X*A=B.
    */
    static findSolutionForMatrixEquation(matrixA: MatrixData, matrixB: MatrixData, verticalElimination: boolean = false) {
        function _findSolutionForMatrixEquation(): FindSolutionMatrixEquationData {

            let _matrixA = matrixA;
            let _matrixB = matrixB;

            if (verticalElimination) {
                _matrixA = MatrixOperations.transpose(matrixA);
                _matrixB = MatrixOperations.transpose(matrixB);
            }

            let matrixACopy = MatrixOperations.copyMatrixData(_matrixA);
            let matrixX = MatrixOperations.copyMatrixData(_matrixB);

            /* if showSteps:
                exibicao_passos_resolver_equacao_matricial(matrixACopy, matrixX, None, None, None, verticalElimination, "Equação inicial:\n") */

            const firstElimination = MatrixOperations.partialGaussianElimination({
                matrixA: matrixACopy,
                matrixB: matrixX,
                eliminateBelowMainDiagonal: true
            });

            const secondElimination = MatrixOperations.partialGaussianElimination({
                ...firstElimination,
                eliminateBelowMainDiagonal: false
            });

            matrixACopy = secondElimination.matrixA;
            matrixX = secondElimination.matrixB;

            const resizedMatrixX = MatrixOperations.resizeMatrixAfterPartialElimination(
                _matrixA,
                _matrixB,
                matrixX
            );

            const multiplication = MatrixOperations.multiplyMatrix(_matrixA, resizedMatrixX);
            console.log({ verticalElimination });
            MatrixOperations.printMatrix(resizedMatrixX);
            MatrixOperations.printMatrix(_matrixA);
            MatrixOperations.printMatrix(multiplication);
            MatrixOperations.printMatrix(_matrixB);

            let systemSolutionsType = MatrixOperations.systemSolutionTypesVerification(
                _matrixB,
                matrixACopy,
                matrixX,
                multiplication
            );

            let partiallyEliminatedOriginal = matrixACopy;
            let solution = matrixX;
            let solutionWithIndependentVariables: MatrixData | undefined = undefined;
            let lettersUsed: Array<string> | undefined = undefined;

            if (systemSolutionsType === SystemSolutionType.SPDOrSPI) {

                // Método de transformar A(mxo) * X(oxn) = B(mxn) 
                // em A((m*n)x(o*n)) * X((o*n)x1) = B((m*n)x1):
                const vectorEquation = MatrixOperations.transformEquationToVectorForm(
                    partiallyEliminatedOriginal,
                    resizedMatrixX,
                    solution
                );

                MatrixOperations.printMatrix(vectorEquation.matrixA);

                // Sendo matrixX um vetor, achar vetor com variáveis independentes:
                // Aqui é feita a separação entre SPD e SPI: 
                const generalVectorData = MatrixOperations.findGeneralVectorForSPDOrSPIEquation(vectorEquation);

                systemSolutionsType = generalVectorData.solutionType;
                lettersUsed = generalVectorData.lettersUsed;

                const devectorizedMatrixX = MatrixOperations.devectorizeVector(
                    generalVectorData.vectorizedX, 
                    resizedMatrixX.dimensions()
                );

                if (systemSolutionsType === SystemSolutionType.SPI)
                    solutionWithIndependentVariables = devectorizedMatrixX;
                else
                    solution = devectorizedMatrixX;

            }

            if (verticalElimination) {
                solution = MatrixOperations.transpose(solution);
                partiallyEliminatedOriginal = MatrixOperations.transpose(partiallyEliminatedOriginal);
                solutionWithIndependentVariables && (
                    solutionWithIndependentVariables = MatrixOperations.transpose(solutionWithIndependentVariables)
                );
            }

            // console.log({
            //     partiallyEliminatedOriginal,
            //     solution,
            //     systemSolutionsType,
            // });

            return {
                partiallyEliminatedOriginal,
                solution,
                systemSolutionsType,
                solutionWithIndependentVariables,
                lettersUsed
            };
        }

        return addErrorTreatment(
            _findSolutionForMatrixEquation,
            'result'
        );
    }

    static transformEquationToVectorForm(matrixA: MatrixData, matrixX: MatrixData, matrixB: MatrixData): TransformEquationToVectorFormData {

        const dimensionsA = matrixA.dimensions();
        const dimensionsX = matrixX.dimensions();

        const newMatrixAData = MatrixOperations.emptyMatrix({
            rows: dimensionsA.rows * dimensionsX.columns,
            columns: dimensionsA.columns * dimensionsX.columns,
        });

        const dimensionsNewA = newMatrixAData.dimensions();

        const vectorizedX = MatrixOperations.vectorizeMatrix(matrixX);
        const vectorizedB = MatrixOperations.vectorizeMatrix(matrixB);

        for (let newRowA = 0; newRowA < dimensionsNewA.rows; newRowA++) {

            const rowA = Math.floor(newRowA / dimensionsX.columns);
            const columnX = newRowA % dimensionsX.columns;

            for (let vectorXIndex = 0; vectorXIndex < vectorizedX.length; vectorXIndex++) {

                if (vectorXIndex % dimensionsX.columns === columnX) {
                    const rowX = Math.floor(vectorXIndex / dimensionsX.columns);
                    const columnA = rowX;
                    newMatrixAData.data[newRowA][vectorXIndex] = matrixA.data[rowA][columnA];
                }

            }

        }

        return {
            matrixA: newMatrixAData,
            vectorizedX,
            vectorizedB
        }

    }

    static devectorizeVector(matrix: Array<ExpressionData>, matrixDimensions: MatrixDimensions) {
        const newData =  matrix.reduce(
            (dataAccumulator, element) => {
                console.log(JSON.stringify({ dataAccumulator }));
                let lastElement = dataAccumulator.pop();
                if (!lastElement)
                    return [[element]]
                if (lastElement.length < matrixDimensions.columns)
                    return [...dataAccumulator, [...lastElement, element]];
                else
                    return [...dataAccumulator, lastElement, [element]];
            },
            [] as Array<MatrixColumnData>
        );

        return new MatrixData(newData);
    }

    static vectorizeMatrix(matrix: MatrixData) {
        const vector = matrix.data.reduce(
            (elementsAccumulator, elementRow) => [...elementsAccumulator, ...elementRow],
            [] as MatrixColumnData
        );
        return vector;
    }

    static findGeneralVectorForSPDOrSPIEquation(vectorEquation: TransformEquationToVectorFormData) {

        const {
            matrixA,
            vectorizedX
        } = vectorEquation;

        const letters = 'mnopqrstuvwxyz'.split('');

        let lettersUsed: Array<string> = [];

        let solutionType = SystemSolutionType.SPD;

        // Definição das variáveis independentes:
        for (let row = 0; row < vectorizedX.length; row++) {
            let allElementsOfRowNull = true;

            for (let column = 0; column < matrixA.dimensions().columns; column++) {
                if (!matrixA.data[row][column].isZero) allElementsOfRowNull = false;
            }

            if (allElementsOfRowNull) {
                solutionType = SystemSolutionType.SPI;

                const variable = letters.splice(0, 1)[0];

                lettersUsed.push(variable);

                vectorizedX[row] = createMatrixElement({
                    variables: [ new VariableData({ variable }) ]
                });
            }
        }

        // Definição das variáveis dependentes:
        // Começa no último elemento antes da variável independente:
        for (let rowIndex = vectorizedX.length - 1; rowIndex >= 0; rowIndex--) {

            for (let columnIndex = matrixA.dimensions().columns - 1; columnIndex > rowIndex; columnIndex--)
                vectorizedX[rowIndex] = ExpressionSimplification.varOperation(
                    vectorizedX[rowIndex],
                    Operator.Subtract,
                    ExpressionSimplification.varOperation(
                        matrixA.data[rowIndex][columnIndex],
                        Operator.Multiply,
                        vectorizedX[columnIndex]
                    )
                );

        }

        return {
            vectorizedX,
            solutionType,
            lettersUsed
        };
    }

    static systemSolutionTypesVerification(
        matrixB: MatrixData,
        matrixACopy: MatrixData,
        matrixX: MatrixData,
        multiplication: MatrixData
    ) {

        /* Se, na expressão, houver uma igualdade de um número nulo com 
        um não nulo fora das dimensoes da matrix final, ela é um SI: */
        for (
            let row = matrixACopy.dimensions().columns;
            row < matrixX.dimensions().rows;
            row++
        ) {
            for (
                let column = 0;
                column < matrixX.dimensions().columns;
                column++
            ) {
                if (!matrixX.data[row][column].isZero) return SystemSolutionType.SI;
            }
        }

        let isSPIorSI = false;

        for (let row = 0; row < matrixB.dimensions().rows; row++) {

            for (let column = 0; column < matrixB.dimensions().columns; column++) {
                if (
                    matrixB.data[row][column].commaStringify()
                    !== multiplication.data[row][column].commaStringify()
                ) {
                    if (
                        !matrixB.data[row][column].hasVariables
                        && !multiplication.data[row][column].hasVariables
                    )
                        return SystemSolutionType.SI;

                    isSPIorSI = true;
                }
            }

        }

        if (isSPIorSI)
            return SystemSolutionType.SPIOrSI;

        return SystemSolutionType.SPDOrSPI;
    }

    static resizeMatrixAfterPartialElimination(matrixA: MatrixData, matrixB: MatrixData, matrixX: MatrixData) {
        return MatrixOperations.resizeMatrix({
            originalMatrix: MatrixOperations.emptyMatrix(matrixX.dimensions()),
            editableMatrix: matrixX,
            rows: matrixA.dimensions().columns,
            columns: matrixB.dimensions().columns,
        });
    }
}

export default MatrixOperations;
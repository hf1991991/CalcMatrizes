import MatrixData from "./MatrixData";
import { smartToFixed, SystemSolutionType, Operator } from "./constants";
import ScalarOperations from "./ScalarOperations";
import * as ExpressionSimplification from "./ExpressionSimplification";
import { ElementData, ExpressionData } from "./ExpressionClasses";

export default class MatrixOperations {

    static changeElement({ matrix, column, row, numberWritten }) {
        let matrixDataCopy = [...matrix.data];
        matrixDataCopy[row][column] = numberWritten;
        return new MatrixData({
            data: matrixDataCopy,
        });
    }

    static insertElementsPosition(matrix) {
        let positionMatrix = [];

        if (!matrix) return positionMatrix;

        for (let column = matrix.dimensions().columns - 1; column >= 0 ; column--) {
            let positionMatrixColumn = [];
            for (let row = matrix.dimensions().rows - 1; row >= 0 ; row--) {
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

    static copyMatrixData(matrix) {
        let copyData = [];

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            let copyDataRow = [];
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                copyDataRow.push(matrix.data[row][column]);
            }
            copyData.push(copyDataRow);
        }

        return new MatrixData({
            data: copyData,
        });
    }

    static minDimensions = (matrix1, matrix2) => ({
        rows: Math.min(matrix1.dimensions().rows, matrix2.dimensions().rows),
        columns: Math.min(matrix1.dimensions().columns, matrix2.dimensions().columns),
    })

    static maxDimensions = (matrix1, matrix2) => ({
        rows: Math.max(matrix1.dimensions().rows, matrix2.dimensions().rows),
        columns: Math.max(matrix1.dimensions().columns, matrix2.dimensions().columns),
    })

    static joinElements = (matrix1, matrix2, row, column) => {
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

    static joinEditableAndOriginalMatrices({ originalMatrix, editableMatrix, rows, columns }) {
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

    static resizeMatrix({ originalMatrix, editableMatrix, rows, columns }) {
        return new MatrixData({
            data: MatrixOperations.joinEditableAndOriginalMatrices({ originalMatrix, editableMatrix, rows, columns }),
        });
    }

    static addColumn(matrix) {
        for (let row of matrix) row.push(0);
        return matrix;
    }

    static removeColumn(matrix) {
        for (let row of matrix) row.pop();
        return matrix;
    }

    static addRow(matrix) {
        matrix.push([]);
        for (let column of matrix[0]) matrix[matrix.length - 1].push(0);
        return matrix;
    }

    static removeRow(matrix) {
        matrix.pop();
        return matrix;
    }

    static getTransposedDimensions(matrix) {
        return MatrixOperations.transpose(matrix).dimensions();
    }

    static isMatrixFull(matrix) {
        if (!matrix) return false;

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                if (Number.isNaN(matrix.data[row][column])) return false;
            }
        }
        return true;
    }

    static isMatrixEmpty(matrix) {
        if (!matrix) return false;

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                if (!Number.isNaN(matrix.data[row][column])) return false;
            }
        }
        return true;
    }

    static isMatrixSquare(matrix) {
        return matrix && matrix.dimensions().rows === matrix.dimensions().columns;
    }

    static printMatrix(matrix) {
        for (row of matrix.data) {
            let rowString = '';
            for (elem of row) {
                rowString += ` ${elem.stringify()} `;
            }
            console.log(rowString);
        }
        console.log('\n');
    }

    static smartToFixedOnMatrix(matrixData) {
        let fixed = [];

        for (let row = 0; row < matrixData.length; row++) {
            let fixedRow = [];
            for (let column = 0; column < matrixData[0].length; column++) {
                fixedRow.push(smartToFixed(matrixData[row][column]));
            }
            fixed.push(fixedRow);
        }

        return fixed;
    }

    static parseFloatPreservingDotAndVariables(string) {
        if (ExpressionSimplification.getVariables(string)) return string;
        return string !== null && (string.toString().endsWith('.') || string.toString().startsWith('0.'))
            ? string
            : Number.parseFloat(string);
    }

    static applyFrescuresToMatrixData(matrixData) {
        if (!matrixData) return null;

        let converted = [];

        for (let row = 0; row < matrixData.length; row++) {
            let convertedRow = [];
            for (let column = 0; column < matrixData[0].length; column++) {
                let element = matrixData[row][column];

                if (!(element instanceof ElementData)) {
                    // console.log('applyFrescuresToMatrixData: elemento não é um ElementData: ' + element);
                    element = new ElementData({
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

    static emptyMatrix({ rows, columns }) {
        let matrix = [];

        for (let row = 0; row < rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < columns; column++) {
                matrixRow.push(0);
            }
            matrix.push(matrixRow);
        }

        return new MatrixData({
            data: matrix,
        });
    }

    static identity(dimension) {
        let identity = [];

        for (let row = 0; row < dimension; row++) {
            let identityRow = [];
            for (let column = 0; column < dimension; column++) {
                identityRow.push(row === column ? 1 : 0);
            }
            identity.push(identityRow);
        }

        return new MatrixData({
            data: identity,
        });
    }

    static sum(matrixA, matrixB) {
        let matrix = [];

        for (let row = 0; row < matrixA.dimensions().rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < matrixA.dimensions().columns; column++) {
                matrixRow.push(
                    Number.parseFloat(matrixA.data[row][column])
                    + Number.parseFloat(matrixB.data[row][column])
                );
            }
            matrix.push(matrixRow);
        }

        return new MatrixData({
            data: matrix,
        });    
    }

    static subtract(matrixA, matrixB) {
        let matrix = [];

        for (let row = 0; row < matrixA.dimensions().rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < matrixA.dimensions().columns; column++) {
                matrixRow.push(
                    Number.parseFloat(matrixA.data[row][column])
                    - Number.parseFloat(matrixB.data[row][column])
                );
            }
            matrix.push(matrixRow);
        }

        return new MatrixData({
            data: matrix,
        });    
    }

    static multiplyMatrix(matrixA, matrixB) {
        let matrix = [];

        for (let row = 0; row < matrixA.dimensions().rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < matrixB.dimensions().columns; column++) {
                let newElement = 0;
                for (let index = 0; index < matrixA.dimensions().columns; index++) {
                    newElement += matrixA.data[row][index] * matrixB.data[index][column];
                }
                matrixRow.push(newElement);
            }
            matrix.push(matrixRow);
        }

        return new MatrixData({
            data: matrix,
        });    
    }

    static multiplyMatrixByScalar({ matrixA, scalar }) {
        let matrix = [];

        for (let row = 0; row < matrixA.dimensions().rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < matrixA.dimensions().columns; column++) {
                matrixRow.push(matrixA.data[row][column] * scalar);
            }
            matrix.push(matrixRow);
        }

        return new MatrixData({
            data: matrix,
        });    
    }

    static transpose(matrix) {
        let transposedData = [];

        for (let column = 0; column < matrix.dimensions().columns; column++) {
            let transposedRow = [];
            for (let row = 0; row < matrix.dimensions().rows; row++) {
                transposedRow.push(matrix.data[row][column]);
            }
            transposedData.push(transposedRow);
        }

        return new MatrixData({
            data: transposedData,
        });
    }

    static invert(matrix) {
        let firstElimination = MatrixOperations.partialGaussianElimination({
            matrixA: matrix,
            matrixB: MatrixOperations.identity(matrix.dimensions().rows),
            eliminateBelowMainDiagonal: true,
        });

        let secondElimination = MatrixOperations.partialGaussianElimination({
            ...firstElimination,
            eliminateBelowMainDiagonal: false,
        });

        return MatrixOperations.copyMatrixData(secondElimination.matrixB);
    }

    static determinant(matrix) {
        return (
            MatrixOperations.isMatrixFull(matrix)
            && MatrixOperations.isMatrixSquare(matrix)
        ) 
            ? MatrixOperations.partialGaussianElimination({
                matrixA: matrix,
                matrixB: MatrixOperations.identity(matrix.dimensions().rows),
                acceptVariables: true,
            }).determinant
            : null;
    }

    /* 
        Escalona a porcao, seja abaixo ou acima, da diagonal principal 
        de matrixA, assim como retorna o determinante da matriz.
        OBS: verticalElimination deve ser verdadeiro se a ordem da equação a ser escalonada é X*A=B.
    */
    static partialGaussianElimination({ matrixA, matrixB, eliminateBelowMainDiagonal=true, acceptVariables=false }) {
        let _matrixA = MatrixOperations.copyMatrixData(matrixA);
        let _matrixB = MatrixOperations.copyMatrixData(matrixB);

        MatrixOperations.printMatrix(_matrixA);

        const dimensionsA = _matrixA.dimensions();
        const dimensionsB = _matrixB.dimensions();

        const minDimensionsA = Math.min(
            dimensionsA.rows,
            dimensionsA.columns,
        );

        let determinant = new ElementData({ scalar: 1 });
        let noPivotOnColumn = false;

        for (
            let pivotColumn = (eliminateBelowMainDiagonal ? 0 : minDimensionsA - 1);
            pivotColumn != (eliminateBelowMainDiagonal ? minDimensionsA : -1);
            pivotColumn += (eliminateBelowMainDiagonal ? 1 : -1)
        ) {
            let pivot = _matrixA.data[pivotColumn][pivotColumn];

            if (pivot.scalar === 0) {

                let testRow = pivotColumn + 1;
                while (true) {
                    // Se houver uma coluna sem pivot em uma matriz escalonada reduzida, o determinante dela é nulo:
                    if (testRow === dimensionsA.columns) {
                        noPivotOnColumn = true;
                        break;
                    }

                    let possibleNewPivot = _matrixA.data[testRow][pivotColumn];

                    if (possibleNewPivot instanceof ElementData && possibleNewPivot.scalar !== 0.0) break;

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

                    determinant = ExpressionSimplification.varOperation(determinant, Operator.Multiply, new ElementData({ scalar: -1 }));
                }
            }

            if (!noPivotOnColumn) {

                console.log({pivot: pivot.stringify(), pivotColumn})

                if (
                    (pivot instanceof ElementData && (pivot.scalar !== 1.0 || pivot.variables.length !== 0))
                    ||
                    (pivot instanceof ExpressionData)
                ) {
                    for (let index = 0; index < dimensionsA.columns; index++)
                        _matrixA.data[pivotColumn][index] = 
                            ExpressionSimplification.varOperation(_matrixA.data[pivotColumn][index], Operator.Divide, pivot);
                    for (let index = 0; index < dimensionsB.columns; index++)
                        _matrixB.data[pivotColumn][index] =
                            ExpressionSimplification.varOperation(_matrixB.data[pivotColumn][index], Operator.Divide, pivot);

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
                    let verticalIndex = null;
                    if (eliminateBelowMainDiagonal)
                        verticalIndex = index + pivotColumn + 1;
                    else
                        verticalIndex = index;

                    const element = _matrixA.data[verticalIndex][pivotColumn];
                    const eliminationFactor = ExpressionSimplification.varOperation(
                        ExpressionSimplification.varOperation(
                            element, 
                            Operator.Multiply, 
                            new ElementData({ scalar: -1 })
                        ), 
                        Operator.Divide, 
                        pivot,
                    );
                    MatrixOperations.printMatrix(_matrixA);

                    console.log({element: element.stringify(), pivot: pivot.stringify(), eliminationFactor: eliminationFactor.stringify()})

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

                    //if (showSteps)
                    //    exibicao_passos_resolver_equacao_matricial(_matrixA, _matrixB, eliminationFactor, pivotColumn+1, verticalIndex+1, verticalElimination, None)
                }
                MatrixOperations.printMatrix(_matrixA);
            } 
        }

        if (noPivotOnColumn) determinant = new ElementData({
            scalar: 0
        });

        console.log({determinant})

        console.log({ determinantString: determinant.stringify() });

        return {
            matrixA: MatrixOperations.copyMatrixData(_matrixA),
            matrixB: MatrixOperations.copyMatrixData(_matrixB),
            determinant: smartToFixed(determinant), 
        };
        // return arredondamento_na_raca(determinant, 6);
    }


    /* 
        Resolve o sistema A * X = B, quando a incognita procede a matriz A conhecida, 
        ou o sistema X * A = B, quando a incognita precede a matriz A conhecida.
        OBS: verticalElimination deve ser verdadeiro se a ordem da equação a ser escalonada é X*A=B.
    */
    static findSolutionForMatrixEquation({ matrixA, matrixB, verticalElimination=false, showSteps }) {
        let matrixACopy = MatrixOperations.copyMatrixData(matrixA);
        let matrixX = MatrixOperations.copyMatrixData(matrixB);
    
        if (verticalElimination) {
            matrixACopy = MatrixOperations.transpose(matrixACopy);
            matrixX = MatrixOperations.transpose(matrixX);
        }
    
        /* if showSteps:
            exibicao_passos_resolver_equacao_matricial(matrixACopy, matrixX, None, None, None, verticalElimination, "Equação inicial:\n") */
    
        const firstElimination = MatrixOperations.partialGaussianElimination({
            matrixA: matrixACopy, 
            matrixB: matrixX, 
            eliminateBelowMainDiagonal: true, 
            showSteps, 
            verticalElimination,
        });
        
        const secondElimination = MatrixOperations.partialGaussianElimination({
            ...firstElimination,
            eliminateBelowMainDiagonal: false, 
            showSteps, 
            verticalElimination,
        });

        matrixACopy = secondElimination.matrixA;
        matrixX = secondElimination.matrixB;
    
        const systemSolutionsType = MatrixOperations.systemSolutionTypesVerification({
            matrixA: matrixACopy, 
            matrixB: matrixX, 
            verticalElimination,
        });
        
        let partiallyEliminatedOriginal = matrixACopy;
        let solution = matrixX;

        if (systemSolutionsType === SystemSolutionType.SPD) {
            solution = MatrixOperations.resizeMatrixAfterPartialElimination({
                matrixA,
                matrixB,
                matrixX,
                verticalElimination,
            });
        }

        if (verticalElimination) {
            solution = MatrixOperations.transpose(solution);
            partiallyEliminatedOriginal = MatrixOperations.transpose(partiallyEliminatedOriginal);
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
        };
    }
    
    static systemSolutionTypesVerification({ matrixA, matrixB, verticalElimination }) {
        /* Se na matriz A houver uma linha completa de 
        elementos nulos e, na mesma linha da matriz B, houver 
        algum elemento não nulo, a expressão é um SI. */

        /*
        MatrixOperations.printMatrix(matrixA);
        MatrixOperations.printMatrix(matrixB);
        */
    
        for (let row = 0; row < matrixA.dimensions().columns; row++) {
            let allElementsOfRowNull = true;

            for (let column = 0; column < matrixA.dimensions().columns; column++) {
                if (matrixA.data && matrixA.data[row] && matrixA.data[row][column] !== 0.0) allElementsOfRowNull = false;
            }

            if (allElementsOfRowNull) {
                for (let column = 0; column < matrixB.dimensions().columns; column++) {
                    if (matrixB.data && matrixB.data[row] && matrixB.data[row][column] !== 0.0) return SystemSolutionType.SI;
                }
                return SystemSolutionType.SPI;
            }
        }

        /* Se, na expressão, houver uma igualdade de um número nulo com 
        um não nulo fora das dimensoes da matrix final, ela é um SI: */
        for (
            let row = matrixA.dimensions().columns; 
            row < matrixB.dimensions().rows; 
            row++
        ) {
            for (
                let column = 0; 
                column < matrixB.dimensions().columns; 
                column++
            ) {
                if (matrixB.data && matrixB.data[row] && matrixB.data[row][column] !== 0) return SystemSolutionType.SI;
            }
        }
        
        return SystemSolutionType.SPD;
    }
    
    static resizeMatrixAfterPartialElimination({ matrixA, matrixB, matrixX, verticalElimination }) {
        return MatrixOperations.resizeMatrix({
            originalMatrix: MatrixOperations.emptyMatrix(matrixX.dimensions()),
            editableMatrix: matrixX,
            rows: verticalElimination ? matrixB.dimensions().rows : matrixA.dimensions().columns,
            columns: verticalElimination ? matrixA.dimensions().rows : matrixB.dimensions().columns,
        });
    }
}
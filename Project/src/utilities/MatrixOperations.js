import MatrixData from "./MatrixData";
import { forceRound, smartToFixed, count } from "./constants";

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
            || null;
        return joinedElement === undefined ? null : joinedElement;
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
        for (let row of matrix) row.push(null);
        return matrix;
    }

    static removeColumn(matrix) {
        for (let row of matrix) row.pop();
        return matrix;
    }

    static addRow(matrix) {
        matrix.push([]);
        for (let column of matrix[0]) matrix[matrix.length - 1].push(null);
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
                if (matrix.data[row][column] === null) return false;
            }
        }
        return true;
    }

    static isMatrixEmpty(matrix) {
        if (!matrix) return false;

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                if (matrix.data[row][column] !== null) return false;
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
                rowString += ` ${elem} `;
            }
            console.log(rowString);
        }
        console.log('\n');
    }

    static smartToFixedOnMatrix(matrix) {
        let fixed = [];

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            let fixedRow = [];
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                fixedRow.push(smartToFixed(matrix.data[row][column]));
            }
            fixed.push(fixedRow);
        }

        return new MatrixData({
            data: fixed,
        });
    }

    static parseFloatPreservingDot(string) {
        return string !== null && string.toString().endsWith('.')
            ? string
            : Number.parseFloat(string);
    }

    static convertStringToNumbers(matrix) {
        if (!matrix) return null;

        let converted = [];

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            let convertedRow = [];
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                const parsed = MatrixOperations.parseFloatPreservingDot(matrix.data[row][column]);
                convertedRow.push(matrix.data[row][column] === null ? null : parsed);
            }
            converted.push(convertedRow);
        }

        return new MatrixData({
            data: converted,
        });
    }

    static emptyMatrix({ rows, columns }) {
        let matrix = [];

        for (let row = 0; row < rows; row++) {
            let matrixRow = [];
            for (let column = 0; column < columns; column++) {
                matrixRow.push(null);
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

        return MatrixOperations.smartToFixedOnMatrix(secondElimination.matrixB);
    }

    static determinant(matrix) {
        return (
            MatrixOperations.isMatrixFull(matrix)
            && MatrixOperations.isMatrixSquare(matrix)
        ) 
            ? MatrixOperations.partialGaussianElimination({
                matrixA: matrix,
                matrixB: MatrixOperations.identity(matrix.dimensions().rows)
            }).determinant
            : null;
    }

    /* 
        Escalona a porcao, seja abaixo ou acima, da diagonal principal 
        de matrixA, assim como retorna o determinante da matriz.
        OBS: verticalElimination deve ser verdadeiro se a ordem da equação a ser escalonada é X*A=B.
    */
    static partialGaussianElimination({ matrixA, matrixB, eliminateBelowMainDiagonal, showSteps=false, verticalElimination=false }) {
        let _matrixA = MatrixOperations.copyMatrixData(matrixA);
        let _matrixB = MatrixOperations.copyMatrixData(matrixB);

        const dimensionsA = _matrixA.dimensions();
        const dimensionsB = _matrixB.dimensions();

        const minDimensionsA = Math.min(
            dimensionsA.rows,
            dimensionsA.columns,
        );

        let determinant = 1;
        let noPivotOnColumn = false;

        for (
            let pivotColumn = (eliminateBelowMainDiagonal ? 0 : minDimensionsA - 1);
            pivotColumn != (eliminateBelowMainDiagonal ? minDimensionsA : -1);
            pivotColumn += (eliminateBelowMainDiagonal? 1 : -1)
        ) {
            let pivot = _matrixA.data[pivotColumn][pivotColumn]

            if (pivot === 0.0) {

                let testRow = pivotColumn + 1;
                while (true) {
                    // Se houver uma coluna sem pivot em uma matriz escalonada reduzida, o determinante dela é nulo:
                    if (testRow === dimensionsA.rows) {
                        noPivotOnColumn = true;
                        break
                    }

                    let possibleNewPivot = _matrixA.data[testRow][pivotColumn];

                    if (possibleNewPivot !== 0.0) break;

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

                    determinant *= -1;
                }
            }

            if (!noPivotOnColumn) {
                if (pivot !== 1.0) {
                    for (let index = 0; index < dimensionsA.columns; index++)
                        _matrixA.data[pivotColumn][index] /= pivot;
                    for (let index = 0; index < dimensionsB.columns; index++)
                        _matrixB.data[pivotColumn][index] /= pivot;

                    determinant *= pivot;

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
                    const eliminationFactor = -element / pivot;

                    for (let horizontalIndex = 0; horizontalIndex < dimensionsA.columns; horizontalIndex++)
                        _matrixA.data[verticalIndex][horizontalIndex] = 
                            _matrixA.data[verticalIndex][horizontalIndex] + 
                            eliminationFactor * _matrixA.data[pivotColumn][horizontalIndex];

                    for (let horizontalIndex = 0; horizontalIndex < dimensionsB.columns; horizontalIndex++)
                        _matrixB.data[verticalIndex][horizontalIndex] = 
                            _matrixB.data[verticalIndex][horizontalIndex] + 
                            eliminationFactor * _matrixB.data[pivotColumn][horizontalIndex];

                    //if (showSteps)
                    //    exibicao_passos_resolver_equacao_matricial(_matrixA, _matrixB, eliminationFactor, pivotColumn+1, verticalIndex+1, verticalElimination, None)
                }
            } 

            // MatrixOperations.printMatrix(_matrixA);
        }

        if (noPivotOnColumn) determinant = 0.0;

        return {
            matrixA: _matrixA,
            matrixB: _matrixB,
            determinant: smartToFixed(determinant), 
        };
        // return arredondamento_na_raca(determinant, 6);
    }

}
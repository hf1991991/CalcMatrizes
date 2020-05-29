import MatrixData from "./MatrixData";

export default class MatrixOperations {

    static changeElement({ currentMatrix, column, row, numberWritten }) {
        let matrixDataCopy = [...currentMatrix.data];
        matrixDataCopy[row][column] = numberWritten;
        return new MatrixData({
            data: matrixDataCopy,
        });
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

        return copyData;
    }

    static transpose(matrix) {
        let transposed = [];

        for (let column = 0; column < matrix.dimensions().columns; column++) {
            let transposedRow = [];
            for (let row = 0; row < matrix.dimensions().rows; row++) {
                transposedRow.push(matrix.data[row][column]);
            }
            transposed.push(transposedRow);
        }

        return transposed;
    }

    static maxDimensions = (matrix1, matrix2) => ({
        rows: Math.max(matrix1.dimensions().rows, matrix2.dimensions().rows),
        columns: Math.max(matrix1.dimensions().columns, matrix2.dimensions().columns),
    })

    static joinElements = (matrix1, matrix2, row, column) => {
        const joinedElement = (matrix1.data[row] && matrix1.data[row][column]) || (matrix2.data[row] && matrix2.data[row][column]);
        return joinedElement === undefined ? null : joinedElement;
    }

    static joinEditableAndOriginalMatrices({ originalMatrix, editableMatrix, rows, columns }) {
        let joined = [];

        for (let row = 0; row < rows; row++) {
            let joinedRow = [];
            for (let column = 0; column < columns; column++) {
                const joinedElement = MatrixOperations.joinElements(editableMatrix, originalMatrix, row, column);
                joinedRow.push(joinedElement);
            }
            joined.push(joinedRow);
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

    static isMatrixFull(matrix) {
        if (!matrix) return false;

        for (let row = 0; row < matrix.dimensions().rows; row++) {
            for (let column = 0; column < matrix.dimensions().columns; column++) {
                if (matrix.data[row][column] === null) return false;
            }
        }
        return true;
    }

}
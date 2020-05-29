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

    static resizeMatrix({ originalMatrix, rows, columns }) {
        let resizedMatrix = MatrixOperations.copyMatrixData(originalMatrix);

        while (resizedMatrix.length != rows) {
            if (resizedMatrix.length > rows) MatrixOperations.removeRow(resizedMatrix);
            else MatrixOperations.addRow(resizedMatrix);
        }

        while ((resizedMatrix[0] || []).length != columns) {
            if ((resizedMatrix[0] || []).length > columns) MatrixOperations.removeColumn(resizedMatrix);
            else MatrixOperations.addColumn(resizedMatrix);
        }

        return new MatrixData({
            data: resizedMatrix,
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

}
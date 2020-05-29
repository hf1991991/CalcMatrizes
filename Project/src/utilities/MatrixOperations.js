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
        let copyDataBeforeEdit = [];

        for (let row = 0; row < matrix.length().rows; row++) {
            let copyDataRow = [];
            for (let column = 0; column < matrix.length().columns; column++) {
                copyDataRow.push(matrix.data[row][column]);
            }
            copyData.push(copyDataRow);
        }

        if (!matrix.dataBeforeEdit) copyDataBeforeEdit = null
        else {
            for (let row = 0; row < matrix.dataBeforeEdit.length; row++) {
                let copyDataBeforeEditRow = [];
                for (let column = 0; column < matrix.dataBeforeEdit[0].length; column++) {
                    copyDataBeforeEditRow.push(matrix.dataBeforeEdit[row][column]);
                }
                copyDataBeforeEdit.push(copyDataBeforeEditRow);
            }
        }

        return {
            data: copyData,
            dataBeforeEdit: copyDataBeforeEdit,
        }
    }

    static transpose(matrix) {
        let transposed = [];

        for (let column = 0; column < matrix.length().columns; column++) {
            let transposedRow = [];
            for (let row = 0; row < matrix.length().rows; row++) {
                transposedRow.push(matrix.data[row][column]);
            }
            transposed.push(transposedRow);
        }

        return transposed;
    }

    static addColumn(currentMatrix) {
        const originalMatrixData = MatrixOperations.copyMatrixData(currentMatrix);
        console.log(originalMatrixData);
        const matrixDataCopy = [...currentMatrix.data.slice()];
        for (let row of matrixDataCopy) row.push(null);
        console.log(originalMatrixData);
        return new MatrixData({
            data: matrixDataCopy,
            dataBeforeEdit: originalMatrixData.dataBeforeEdit || originalMatrixData.data,
        });
    }

    static removeColumn(currentMatrix) {
        const originalMatrixData = MatrixOperations.copyMatrixData(currentMatrix);
        console.log(originalMatrixData);
        const matrixDataCopy = [...currentMatrix.data.slice()];
        for (let row of matrixDataCopy) row.pop();
        console.log(originalMatrixData);
        return new MatrixData({
            data: matrixDataCopy,
            dataBeforeEdit: originalMatrixData.dataBeforeEdit || originalMatrixData.data,
        });
    }

}
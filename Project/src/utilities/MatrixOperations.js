export default class MatrixOperations {

    static transpose(matrix) {
        let transposed = [];

        for (let column = 0; column < matrix[0].length; column++) {
            let transposedRow = [];
            for (let row = 0; row < matrix.length; row++) {
                transposedRow.push(matrix[row][column]);
            }
            transposed.push(transposedRow);
        }

        return transposed;
    }

}
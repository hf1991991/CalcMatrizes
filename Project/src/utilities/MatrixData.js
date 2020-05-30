export default class MatrixData {

    constructor({ data }) {
        this.data = data;
    }

    dimensions() {
        return {
            rows: this.data.length,
            columns: this.data[0] && this.data[0].length,
        };
    }

    hasPosition({ row, column }) {
        return row < this.dimensions().rows && column < this.dimensions().columns;
    } 
}
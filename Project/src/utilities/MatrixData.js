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
}
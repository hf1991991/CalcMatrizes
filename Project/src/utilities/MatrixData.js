export default class MatrixData {

    constructor({ data, dataBeforeEdit }) {
        this.data = data;
        this.dataBeforeEdit = dataBeforeEdit;
    }

    length() {
        return {
            rows: this.data.length,
            columns: this.data[0].length,
        };
    }
}
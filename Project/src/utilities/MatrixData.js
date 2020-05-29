export default class MatrixData {

    constructor(data) {
        this.data = data;
    }

    length() {
        return {
            rows: this.data.length,
            columns: this.data[0].length,
        };
    }
}
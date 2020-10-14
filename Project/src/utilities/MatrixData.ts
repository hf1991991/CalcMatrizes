import { ElementData } from "./ExpressionClasses";
import MatrixOperations from "./MatrixOperations";

export interface MatrixDimensions {
    rows: number;
    columns: number;
}

export default class MatrixData {
    data: Array<Array<ElementData>>;

    constructor({ data }) {
        this.data = MatrixOperations.applyFrescuresToMatrixData(data);
    }

    dimensions(): MatrixDimensions {
        return {
            rows: this.data.length,
            columns: this.data[0] && this.data[0].length,
        };
    }

    hasPosition({ row, column }) {
        return row < this.dimensions().rows && column < this.dimensions().columns;
    } 
}
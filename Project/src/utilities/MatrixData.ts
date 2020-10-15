import MatrixDimensions from "../interfaces/MatrixDimensions";
import SelectedMatrixElement from "../interfaces/SelectedMatrixElement";
import { ElementData, ExpressionData } from "./ExpressionClasses";
import MatrixOperations from "./MatrixOperations";

export default class MatrixData {
    data: Array<Array<ElementData | ExpressionData>>;

    constructor(data: Array<Array<ElementData | ExpressionData>>) {
        this.data = MatrixOperations.applyFrescuresToMatrixData(data);
    }

    dimensions(): MatrixDimensions {
        return {
            rows: this.data.length,
            columns: this.data[0] && this.data[0].length,
        };
    }

    hasPosition({ row, column }: SelectedMatrixElement) {
        return row < this.dimensions().rows && column < this.dimensions().columns;
    } 
}
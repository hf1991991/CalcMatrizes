import MatrixDimensions from "../interfaces/MatrixDimensions";
import SelectedMatrixElement from "../interfaces/SelectedMatrixElement";

import * as math from 'mathjs';

class MatrixData {
    data: math.Matrix;

    constructor(data: Array<Array<number>> | math.Matrix) {
        this.data = math.matrix(data);
    }

    dimensions(): MatrixDimensions {
        return {
            rows: this.data.size()[0],
            columns: this.data.size()[1]
        };
    }

    hasPosition({ row, column }: SelectedMatrixElement) {
        return row < this.dimensions().rows && column < this.dimensions().columns;
    } 
}

export default MatrixData;
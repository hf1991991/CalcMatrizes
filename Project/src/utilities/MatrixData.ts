import MatrixDimensions from "../interfaces/MatrixDimensions";
import SelectedMatrixElement from "../interfaces/SelectedMatrixElement";

import * as math from 'mathjs';

class MatrixData {
    raw: math.Matrix;
    data: number[][];

    constructor(data: Array<Array<number>> | math.Matrix) {
        this.raw = math.matrix(data);
        this.data = this.raw.toArray() as number[][];
    }

    dimensions(): MatrixDimensions {
        return {
            rows: this.raw.size()[0],
            columns: this.raw.size()[1]
        };
    }

    hasPosition({ row, column }: SelectedMatrixElement) {
        return row < this.dimensions().rows && column < this.dimensions().columns;
    } 
}

export default MatrixData;
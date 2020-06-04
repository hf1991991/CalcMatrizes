import { MatrixState, SystemSolutionType } from './constants';

export default class EquationData {

    constructor({ fullEquation, viewReduced=false }) {
        switch (fullEquation.equationType) {
            case MatrixState.AxXeB:
                if (fullEquation.solutionType !== SystemSolutionType.SPD) {
                    this.firstOperator = '×';
                    this.variablePosition = 2;
                    this.secondOperator = '=';
                    if (viewReduced) {
                        this.matrix1 = fullEquation.matrixD;
                        this.matrix3 = fullEquation.matrixC;
                    } else {
                        this.matrix1 = fullEquation.matrixA;
                        this.matrix3 = fullEquation.matrixB;
                    }
                }
                else {
                    this.matrix1 = fullEquation.matrixA;
                    this.firstOperator = '×';
                    this.matrix2 = fullEquation.matrixC;
                    this.secondOperator = '=';
                    this.matrix3 = fullEquation.matrixB;
                }
                break;
            case MatrixState.BxXeA:
                if (fullEquation.solutionType !== SystemSolutionType.SPD) {
                    this.firstOperator = '×';
                    this.variablePosition = 2;
                    this.secondOperator = '=';
                    if (viewReduced) {
                        this.matrix1 = fullEquation.matrixC;
                        this.matrix3 = fullEquation.matrixD;
                    } else {
                        this.matrix1 = fullEquation.matrixB;
                        this.matrix3 = fullEquation.matrixA;
                    }
                }
                else {
                    this.matrix1 = fullEquation.matrixB;
                    this.firstOperator = '×';
                    this.matrix2 = fullEquation.matrixC;
                    this.secondOperator = '=';
                    this.matrix3 = fullEquation.matrixA;
                }
                break;
            case MatrixState.XxAeB:
                if (fullEquation.solutionType !== SystemSolutionType.SPD) {
                    this.firstOperator = '×';
                    this.variablePosition = 1;
                    this.secondOperator = '=';
                    if (viewReduced) {
                        this.matrix2 = fullEquation.matrixD;
                        this.matrix3 = fullEquation.matrixC;
                    } else {
                        this.matrix2 = fullEquation.matrixA;
                        this.matrix3 = fullEquation.matrixB;
                    }
                }
                else {
                    this.matrix1 = fullEquation.matrixC;
                    this.firstOperator = '×';
                    this.matrix2 = fullEquation.matrixA;
                    this.secondOperator = '=';
                    this.matrix3 = fullEquation.matrixB;
                }
                break;
            case MatrixState.XxBeA:
                if (fullEquation.solutionType !== SystemSolutionType.SPD) {
                    this.firstOperator = '×';
                    this.variablePosition = 1;
                    this.secondOperator = '=';
                    if (viewReduced) {
                        this.matrix2 = fullEquation.matrixC;
                        this.matrix3 = fullEquation.matrixD;
                    } else {
                        this.matrix2 = fullEquation.matrixB;
                        this.matrix3 = fullEquation.matrixA;
                    }
                }
                else {
                    this.matrix1 = fullEquation.matrixC;
                    this.firstOperator = '×';
                    this.matrix2 = fullEquation.matrixB;
                    this.secondOperator = '=';
                    this.matrix3 = fullEquation.matrixA;
                }
                break;
            default:
                break;
        }
    }

    getQuantityOfMatrices() {
        return (this.matrix1 !== undefined) + (this.matrix2 !== undefined) + (this.matrix3 !== undefined);
    }

    getQuantityOfOperators() {
        return (this.firstOperator !== undefined) + (this.secondOperator !== undefined);
    }

    hasXOperator() {
        return this.variablePosition !== undefined;
    }

    getVariableDimensions() {
        if (this.variablePosition === 1)
            return `${this.matrix3.dimensions().rows}x${this.matrix2.dimensions().rows}`;
        else
            return `${this.matrix1.dimensions().columns}x${this.matrix3.dimensions().columns}`;
    }

}
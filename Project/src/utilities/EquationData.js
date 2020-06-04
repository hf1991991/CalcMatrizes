import { MatrixState, SystemSolutionType } from './constants';

export default class EquationData {

    constructor(fullEquation) {
        switch (fullEquation.equationType) {
            case MatrixState.AxXeB:
                if (fullEquation.solutionType !== SystemSolutionType.SPD) {
                    this.matrix1 = fullEquation.matrixD;
                    this.firstOperator = '×';
                    this.variablePosition = 2;
                    this.secondOperator = '=';
                    this.matrix3 = fullEquation.matrixC;
                }
                else {
                    this.matrix1 = fullEquation.matrixA;
                    this.firstOperator = '×';
                    this.matrix2 = fullEquation.matrixC;
                    this.secondOperator = '=';
                    this.matrix3 = fullEquation.matrixB;
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

}
import { CalcState, SystemSolutionType } from '../utilities/constants';
import MatrixData from '../utilities/MatrixData';

interface FullEquationData {
    equationType: CalcState;
    solutionType: SystemSolutionType;
    matrixA: MatrixData;
    matrixB: MatrixData;
    matrixC: MatrixData;
    matrixD: MatrixData;
}

export default FullEquationData;
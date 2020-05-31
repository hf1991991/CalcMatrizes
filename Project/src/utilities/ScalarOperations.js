import { Operator } from "./constants";

export default class ScalarOperations {

    static applyOperation({ operation, scalar1, scalar2 }) {

        scalar1 = Number.parseFloat(scalar1);
        scalar2 = Number.parseFloat(scalar2);

        switch (operation) {
            case Operator.Add:
                return scalar1 + scalar2;
            case Operator.Subtract:
                return scalar1 - scalar2;
            case Operator.Multiply:
                return scalar1 * scalar2;
            case Operator.Divide:
                return scalar1 / scalar2;
            default:
                return scalar1;
        }

    }

}
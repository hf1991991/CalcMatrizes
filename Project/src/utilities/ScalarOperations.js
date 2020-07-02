import { Operator, count } from "./constants";

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

    static parseFloatWithoutNaN(string) {
        const scalar = Number.parseFloat(string);
        return Number.isNaN(scalar) ? null : scalar;
    }

    

    static isNumber(element) {
        const letters = /[a-i]/;
        if (count(element, letters, true) > 0) return false;
        return !Number.isNaN(element) 
            && count(element.toString(), '\\(', true) === 0
            && count(element.toString(), '\\)', true) === 0;
    }

    static superscript(number) {
        number = number.toString();
        for (let index = 0; index < number.length; index++) {
            number[index] = {
                '0': '\u00B0',
                '1': '\u00B1',
                '2': '\u00B2',
                '3': '\u00B3',
                '4': '\u00B4',
                '5': '\u00B5',
                '6': '\u00B6',
                '7': '\u00B7',
                '8': '\u00B8',
                '9': '\u00B9',
            }
        }
    }

}
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
        let newNumber = '';
        for (let index = 0; index < number.length; index++) {
            switch (number[index]) {
                case '0':
                    newNumber += '\u2070';
                    break;
                case '1':
                    newNumber +=  '\u00B9';
                    break;
                case '2':
                    newNumber += '\u00B2';
                    break;
                case '3':
                    newNumber += '\u00B3';
                    break;
                case '4':
                    newNumber += '\u2074';
                    break;
                case '5':
                    newNumber += '\u2075';
                    break;
                case '6':
                    newNumber += '\u2076';
                    break;
                case '7':
                    newNumber += '\u2077';
                    break;
                case '8':
                    newNumber += '\u2078';
                    break;
                case '9':
                    newNumber += '\u2079';
                    break;
                case '-':
                    newNumber += '\u207B';
                    break;
                case '+':
                    newNumber += '\u207A';
                    break;
                case '/':
                    newNumber += '\u141F';
                    break;
                case '(':
                    newNumber += '\u207D';
                    break;
                case ')':
                    newNumber += '\u207E';
                    break;
                default:
                    newNumber += number[index];
                    break;
            }
        }
        return newNumber;
    }

}
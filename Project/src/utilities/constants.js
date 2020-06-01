export const MatrixState = {
    ready: 'ready',
    editing: 'editing',
    addMatrix: 'addMatrix',
    subtractMatrix: 'subtractMatrix',
    AxB: 'AxB',
    BxA: 'BxA',
    LambdaxA: 'LambdaxA',
}

export const Operator = {
    Add: 'Add',
    Subtract: 'Subtract',
    Multiply: 'Multiply',
    Divide: 'Divide',
}

export const ButtonType = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    0: 0,
    Comma: 'Comma',
    AC: 'AC',
    CE: 'CE',
    Operators: 'Operators',
    Save: 'Save',
    SavedList: 'SavedList',
    Second: 'Second',
    ColumnDirection: 'ColumnDirection',
    R: 'R',
    LambdaxA: 'LambdaxA',
    AxB: 'AxB',
    BxA: 'BxA',
    Inverse: 'Inverse',
    Transposed: 'Transposed',
    Subtract: 'Subtract',
    Add: 'Add',
    SubtractMatrix: 'SubtractMatrix',
    AddMatrix: 'AddMatrix',
    Multiply: 'Multiply',
    Divide: 'Divide',
    Enter: 'Enter',
    Check: 'Check',
}

export function count(string, substring, caseSensitive) {
    // Se caseSensitive for indefinido, ele é considerada falsa:
    return ((caseSensitive ? string.toString() : string.toString().toLowerCase()).match(new RegExp((caseSensitive ? substring : substring.toLowerCase()), "g")) || []).length;
}; 

export function decimalPlaces(number) {
    return number.toString().split(".").pop().length;
}

export function smartToFixed(element) {
    const PRECISION = 5;

    // A precisao define quantos zeros ou noves seguidos apos a virgula a funcao deveria aceitar para que ela arredende o numero:
    function lastDigitIndex(string) {
        let index = 0;
        let repetitions = 0;
        for (let i = 0; i < string.length - 1; i++) {
            const substring = string.substring(i + 1, i + 2);
            const lastSubstring = string.substring(i, i + 1);
            if (substring !== lastSubstring || (substring !== "0" && substring !== "9")) {
                repetitions = 0;
                index = i;
            }
            else repetitions += 1;
            if (repetitions === PRECISION) return index + 1;
        }
        return null;
    }
    
    const digits = element.toString().split(".").pop();
    
    // console.log({element, lastDig: lastDigitIndex(digits)});
    if (lastDigitIndex(digits) !== null) {
        return element.toFixed(lastDigitIndex(digits));
    }
    else
        return element;
}

export function findFraction(number) {
    const MAX_DENOMINATOR = 10000;

    let numerator = null;
    
    for (let denominator = 1; denominator < MAX_DENOMINATOR; denominator++) {
        numerator = smartToFixed(number * denominator);
        /* 
        console.log({
            number,
            numerator: numerator.toString(),
            endsWith: numerator.toString().endsWith('.0'),
            denominator,
            dots: count(numerator, /\./, true)
        });
        */
        if (count(numerator, /\./, true) === 0 || numerator.toString().endsWith('.0')) {
            if (denominator === 1) return number;
            if (numerator.toString().endsWith('.0')) numerator = numerator.toString().split('.')[0];
            return `${numerator}/${denominator}`;
        }
    }

    return number;
}

export function toFixedOnZeroes(number) {
    let string = number.toString();
    if (string.endsWith('.')) return string;
    if (count(string, /\./, true) === 0) return number;
    while (string.endsWith('0')) string = string.substring(0, string.length - 1);
    if (string.endsWith('.')) string = string.substring(0, string.length - 1);
    return Number.parseFloat(string);
}
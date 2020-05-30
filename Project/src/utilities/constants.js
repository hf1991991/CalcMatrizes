export const MatrixState = {
    ready: 'ready',
    editing: 'editing',
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

export function smartToFixed(element) {
    const PRECISION = 6;

    // A precisao define quantos zeros ou noves seguidos apos a virgula a funcao deveria aceitar para que ela arredende o numero:
    function lastDigitIndex(string) {
        let index = 0
        let repetitions = 0
        for (let i = 0; i < string.length; i++) {
            const substring = string.substring(i, i + 1);
            if (substring !== "0" && substring !== "9") {
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
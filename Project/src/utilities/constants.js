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
    Multiply: 'Multiply',
    Divide: 'Divide',
    Enter: 'Enter',
    Check: 'Check',
}

export function count(string, substring, caseSensitive) {
    // Se caseSensitive for indefinido, ele é considerada falsa:
    return ((caseSensitive ? string.toString() : string.toString().toLowerCase()).match(new RegExp((caseSensitive ? substring : substring.toLowerCase()), "g")) || []).length;
}; 
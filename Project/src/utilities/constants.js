export const KeyboardState = {
    matrixReady: 'matrixReady',
    changingMatrix: 'changingMatrix',
}

export function count(string, substring, caseSensitive) {
    // Se caseSensitive for indefinido, ele é considerada falsa:
    return ((caseSensitive ? string.toString() : string.toString().toLowerCase()).match(new RegExp((caseSensitive ? substring : substring.toLowerCase()), "g")) || []).length;
}; 
import { smartToFixed, findFraction, Operator, parenthesisEnglobe, toFixedWithThreeDots } from "./constants";
import ScalarOperations from "./ScalarOperations";

interface ExpressionDataParams {
    operator: Operator;
    elements: Array<ElementData>;
    isSimplified?: boolean;
}

export class ExpressionData {

    operator: Operator;
    elements: Array<ElementData>;
    isSimplified: boolean;

    constructor({ operator, elements, isSimplified=false }: ExpressionDataParams) {
        this.operator = operator;
        this.elements = elements;
        this.isSimplified = isSimplified;

        operator === Operator.Add && this.sortElements();
    }

    sortElements() {
        this.elements.sort((a, b) => {
            return a.stringify().replace(/-/g, '').localeCompare(b.stringify().replace(/-/g, ''))
        });
    }

    commaStringify({ dontFindFraction=false }={}) {
        const string = this.algebraicStringify({ dontFindFraction }).replace('.', ',');
        return parenthesisEnglobe(string)
            ? string.substring(1, string.length - 1)
            : string;
    }

    algebraicStringify({ dontFindFraction=false }={}) {
        switch (this.operator) {
            case Operator.Elevate:
                const base = this.elements[0].algebraicStringify({ dontFindFraction });
                const exponent = this.elements[1].algebraicStringify({ dontFindFraction });
                return `(${
                        parenthesisEnglobe(base)
                            ? base.substring(1, base.length - 1)
                            : base
                    })${
                        ScalarOperations.superscript(exponent)
                    }`;
            case Operator.Divide:
                return `${this.elements[0].algebraicStringify({ dontFindFraction })}/(${this.elements.splice(1, this.elements.length - 1).map(a => a.algebraicStringify({ dontFindFraction })).join(')/(')}`;
            case Operator.Multiply:
                return `${this.elements.map(a => a.algebraicStringify({ dontFindFraction })).join('×')}`;
            case Operator.Add:
                const terms = this.elements.map(a => a.algebraicStringify({ dontFindFraction })).map(a => a.startsWith('-') ? a : '+' + a).join('');
                return `(${terms.startsWith('+') ? terms.substring(1, terms.length) : terms})`;
            case Operator.Subtract:
                return `(${this.elements[0].algebraicStringify({ dontFindFraction })}-${this.elements.splice(1, this.elements.length - 1).map(a => a.algebraicStringify({ dontFindFraction })).join('-')})`;
        }
    }

    stringify() {
        return `${this.operator}(${this.elements.map(elem => elem.stringify()).join(';')})`
    }

} 

interface ElementDataParams {
    variables?: Array<VariableData>;
    scalar?: number | string;
    unfilteredString?: boolean;
}

export class ElementData {

    variables: Array<VariableData>;
    scalar: number | string;
    unfilteredString: boolean;

    constructor({ variables=[], scalar=1, unfilteredString=false }: ElementDataParams) {
        this.variables = variables;
        this.scalar = unfilteredString ? scalar : smartToFixed(scalar);
        this.unfilteredString = unfilteredString;

        this.fixVariables()
    }

    fixVariables() {
        let fixed = [];

        // console.log(JSON.stringify({jaca: this.variables}))

        for (let variableData of this.variables) {
            const index = fixed.map(vari => vari.variable).indexOf(variableData.variable)

            // console.log(JSON.stringify({index, variableData, fixed}))

            if (index !== -1) {
                fixed[index] = new VariableData({
                    variable: variableData.variable,
                    exponent: fixed[index].exponent + variableData.exponent
                });
            }
            else
                fixed.push(variableData);
        }

        fixed.sort((a, b) => a.variable.localeCompare(b.variable));

        // this.variables.length > 0 && console.log({fixed, v: this.variables})

        this.variables = fixed.filter((elem => elem.exponent !== 0));

        // console.log({varrrrr: this.variables});
    }

    commaStringify({ dontFindFraction=false }={}) {
        return this.stringify({ dontFindFraction }).replace('.', ',');
    }

    algebraicStringify({ dontFindFraction=false }={}) {
        return this.stringify({ dontFindFraction });
    }

    stringify({ onlyVariables=false, dontFindFraction=false }={}) {

        const findPossibleFraction =
            (number) => dontFindFraction
                ? toFixedWithThreeDots(number)
                : findFraction(number);

        const formatScalar = 
            () => (this.scalar === 1 && this.variables.length !== 0) || onlyVariables
                ? ''
                : this.scalar === -1 && this.variables.length !== 0
                    ? '-'
                    : findPossibleFraction(this.scalar)
        const formatExponent = 
            (exponent) => exponent === 1
                ? ''
                : ScalarOperations.superscript(findPossibleFraction(exponent))
        const formatVariables = 
            () => this.variables.map(
                    vari => `${vari.variable}${formatExponent(vari.exponent)}`
                )
        return [formatScalar(), ...formatVariables()].join('')
    }

} 

export class VariableData {

    variable: string;
    exponent: number;

    constructor({ variable, exponent=1 }) {
        this.variable = variable;
        this.exponent = exponent;
    }

} 


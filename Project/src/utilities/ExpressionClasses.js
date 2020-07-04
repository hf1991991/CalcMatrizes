import { smartToFixed, findFraction, Operator, parenthesisEnglobe } from "./constants";
import ScalarOperations from "./ScalarOperations";

export class ExpressionData {

    constructor({ operator, elements, isSimplified=false }) {
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

    simpleStringify() {
        const string = this.algebraicStringify();
        return parenthesisEnglobe(string)
            ? string.substring(1, string.length - 1)
            : string;
    }

    algebraicStringify() {
        switch (this.operator) {
            case Operator.Elevate:
                const base = this.elements[0].algebraicStringify();
                const exponent = this.elements[1].algebraicStringify();
                return `(${
                        parenthesisEnglobe(base)
                            ? base.substring(1, base.length - 1)
                            : base
                    })^${
                        exponent.startsWith('-')
                            ? `(${exponent})`
                            : exponent
                    }`;
            case Operator.Divide:
                return `${this.elements[0].algebraicStringify()}/(${List.from(this.elements).splice(1, this.elements.length - 1).map(a => a.algebraicStringify()).join(')/(')}`;
            case Operator.Multiply:
                return `${this.elements.map(a => a.algebraicStringify()).join('×')}`;
            case Operator.Add:
                const terms = this.elements.map(a => a.algebraicStringify()).map(a => a.startsWith('-') ? a : '+' + a).join('');
                return `(${terms.startsWith('+') ? terms.substring(1, terms.length) : terms})`;
            case Operator.Subtract:
                return `(${this.elements[0].algebraicStringify()}-${List.from(this.elements).splice(1, this.elements.length - 1).map(a => a.algebraicStringify()).join('-')})`;
        }
    }

    stringify() {
        return `${this.operator}(${this.elements.map(elem => elem.stringify()).join(';')})`
    }

} 

export class ElementData {

    constructor({ variables=[], scalar=1, unfilteredString=null }) {
        this.variables = variables;
        this.scalar = unfilteredString ? scalar : smartToFixed(scalar);
        this.unfilteredString = unfilteredString;

        this.fixVariables()
    }

    fixVariables() {
        let fixed = [];

        // console.log(JSON.stringify({jaca: this.variables}))

        for (variableData of this.variables) {
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

    simpleStringify() {
        return this.stringify();
    }

    algebraicStringify() {
        return this.stringify();
    }

    stringify({ onlyVariables=false }={}) {
        const formatScalar = 
            () => (this.scalar === 1 && this.variables.length !== 0) || onlyVariables
                ? ''
                : this.scalar === -1 && this.variables.length !== 0
                    ? '-'
                    : findFraction(this.scalar)
        const formatExponent = 
            (exponent) => exponent === 1
                ? ''
                : `^(${findFraction(exponent)})`
        const formatVariables = 
            () => this.variables.map(
                    vari => `${vari.variable}${formatExponent(vari.exponent)}`
                )
        return [formatScalar(), ...formatVariables()].join('')
    }

} 

export class VariableData {

    constructor({ variable, exponent=1 }) {
        this.variable = variable;
        this.exponent = exponent;
    }

} 


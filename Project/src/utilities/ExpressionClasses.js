import { smartToFixed, findFraction, Operator } from "./constants";
import ScalarOperations from "./ScalarOperations";

export class ExpressionData {

    constructor({ operator, elements, isSimplified=false }) {
        this.operator = operator;
        this.elements = elements;
        this.isSimplified = isSimplified;
    }

    algebraicStringify() {
        switch (this.operator) {
            case Operator.Elevate:
                return `(${this.elements[0].algebraicStringify()})^(${this.elements[1].algebraicStringify()})`;
            case Operator.Divide:
                return `(${this.elements[0].algebraicStringify()})/(${List.from(this.elements).splice(1, this.elements.length - 1).map(a => a.algebraicStringify()).join(')/(')})`;
            case Operator.Multiply:
                return `(${this.elements.map(a => a.algebraicStringify()).join(')x(')})`;
            case Operator.Add:
                return `(${this.elements.map(a => a.algebraicStringify()).join(')+(')})`;
            case Operator.Subtract:
                return `(${this.elements[0].algebraicStringify()})-(${List.from(this.elements).splice(1, this.elements.length - 1).map(a => a.algebraicStringify()).join(')-(')})`;
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


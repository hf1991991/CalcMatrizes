import { smartToFixed, findFraction } from "./constants";
import ScalarOperations from "./ScalarOperations";

export class ExpressionData {

    constructor({ operator, elements, isSimplified=false }) {
        this.operator = operator;
        this.elements = elements;
        this.isSimplified = isSimplified;
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

        for (variableData of this.variables) {
            const index = fixed.map(vari => vari.variable).indexOf(variableData.variable)
            if (index !== -1) {
                if (fixed[index].exponent + variableData.exponent !== 0)
                    fixed[index] = new VariableData({
                        variable: variableData.variable,
                        exponent: fixed[index].exponent + variableData.exponent
                    });
                else
                    fixed.splice(index)
            }
            else
                fixed.push(variableData);
        }

        fixed.sort((a, b) => a.variable.localeCompare(b.variable));

        // this.variables.length > 0 && console.log({fixed, v: this.variables})

        this.variables = fixed;

        // console.log({varrrrr: this.variables});
    }

    stringify() {
        const formatScalar = 
            () => this.scalar === 1 && this.variables.length !== 0
                ? ''
                : this.scalar === -1
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


import { smartToFixed, findFraction, Operator, parenthesisEnglobe, toFixedWithThreeDots } from "./constants";
import ScalarOperations from "./ScalarOperations";

interface ExpressionDataParams {
    elements?: Array<ExpressionData>;
    oneElement?: ElementData;
    operator?: Operator;
    isSimplified?: boolean;
}

export class ExpressionData {

    elements: Array<ExpressionData>;
    oneElement: ElementData | undefined;
    operator: Operator;
    isSimplified: boolean;
    isZero: boolean;
    isOne: boolean;

    constructor({ elements, oneElement, operator = Operator.None, isSimplified = false }: ExpressionDataParams) {
        if (!!oneElement && !!elements) {
            console.log(oneElement.stringify());
            console.log(elements.map(e => e.algebraicStringify()));
            throw 'oneElement and elements can\'t both be defined';
        }

        if (!!oneElement && operator !== Operator.None)
            throw 'oneElement should always use Operator.None';

        this.elements = elements || [];

        this.oneElement = oneElement;

        this.operator = operator;

        this.isSimplified = !oneElement ? isSimplified : true;

        this.isZero = this.commaStringify() === '0';

        this.isOne = this.commaStringify() === '1';

        operator === Operator.Add && this.sortElements();
    }

    sortElements() {
        this.elements.sort((a, b) => {
            return a.stringify().replace(/-/g, '').localeCompare(b.stringify().replace(/-/g, ''))
        });
    }

    commaStringify({ dontFindFraction = false } = {}) {
        const string = this.algebraicStringify({ dontFindFraction }).replace('.', ',');
        return parenthesisEnglobe(string)
            ? string.substring(1, string.length - 1)
            : string;
    }

    algebraicStringify({ dontFindFraction = false } = {}): string {
        switch (this.operator) {
            case Operator.Elevate:
                const base = this.elements[0].algebraicStringify({ dontFindFraction });
                const exponent = this.elements[1].algebraicStringify({ dontFindFraction });
                return `(${parenthesisEnglobe(base)
                        ? base.substring(1, base.length - 1)
                        : base
                    })${ScalarOperations.superscript(exponent)
                    }`;
            case Operator.Divide:
                return `${this.elements[0].algebraicStringify({ dontFindFraction })}/(${[...this.elements].splice(1, this.elements.length - 1).map(a => a.algebraicStringify({ dontFindFraction })).join(')/(')}`;
            case Operator.Multiply:
                return `${this.elements.map(a => a.algebraicStringify({ dontFindFraction })).join('×')}`;
            case Operator.Add:
                const terms = this.elements.map(a => a.algebraicStringify({ dontFindFraction })).map(a => a.startsWith('-') ? a : '+' + a).join('');
                return `(${terms.startsWith('+') ? terms.substring(1, terms.length) : terms})`;
            case Operator.Subtract:
                return `(${this.elements[0].algebraicStringify({ dontFindFraction })}-${[...this.elements].splice(1, this.elements.length - 1).map(a => a.algebraicStringify({ dontFindFraction })).join('-')})`;
            case Operator.None:
                if (!(this.oneElement instanceof ElementData))
                    throw `${this}.oneElement is not ElementData`;
                return this.oneElement.stringify({ dontFindFraction });
        }
    }

    stringify(): string {
        return this.oneElement instanceof ElementData
            ? this.oneElement.stringify()
            : `${this.operator}(${this.elements.map(elem => elem.stringify()).join(';')})`
    }

}

export interface ElementDataParams {
    variables?: Array<VariableData>;
    scalar?: number | string;
    unfilteredString?: string;
}

export class ElementData {

    variables: Array<VariableData>;
    scalar: number;
    unfilteredString: string | undefined;

    constructor({ variables = [], scalar = 1, unfilteredString }: ElementDataParams) {
        this.variables = variables;
        this.scalar = smartToFixed(Number.parseFloat(scalar.toString()));
        this.unfilteredString = unfilteredString;

        this.fixVariables()
    }

    fixVariables() {
        let fixed: Array<VariableData> = [];

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

    commaStringify({ dontFindFraction = false } = {}) {
        return this.stringify({ dontFindFraction }).replace('.', ',');
    }

    stringify({ onlyVariables = false, dontFindFraction = false } = {}) {

        if (!!this.unfilteredString) return this.unfilteredString;

        const findPossibleFraction =
            (number: number | string) => dontFindFraction || Number.isNaN(number)
                ? toFixedWithThreeDots(number)
                : findFraction(number as number);

        const formatScalar =
            () => (this.scalar === 1 && this.variables.length !== 0) || onlyVariables
                ? ''
                : this.scalar === -1 && this.variables.length !== 0
                    ? '-'
                    : findPossibleFraction(this.scalar)
        const formatExponent =
            (exponent: number) => exponent === 1
                ? ''
                : ScalarOperations.superscript(findPossibleFraction(exponent))
        const formatVariables =
            () => this.variables.map(
                vari => `${vari.variable}${formatExponent(vari.exponent)}`
            )
        return [formatScalar(), ...formatVariables()].join('')
    }

}

interface VariableDataParams {
    variable: string;
    exponent?: number;
}

export class VariableData {

    variable: string;
    exponent: number;

    constructor({ variable, exponent = 1 }: VariableDataParams) {
        this.variable = variable;
        this.exponent = exponent;
    }

}

export const createMatrixElement = (data: ElementDataParams | ExpressionDataParams): ExpressionData => (
    !(data as ExpressionDataParams)?.operator
        ? new ExpressionData({
            oneElement: new ElementData(data as ElementDataParams)
        })
        : new ExpressionData(data as ExpressionDataParams)
);


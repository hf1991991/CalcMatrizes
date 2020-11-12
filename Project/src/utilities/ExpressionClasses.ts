import { 
    smartToFixed, 
    findFraction, 
    Operator, 
    parenthesisEnglobe, 
    indentExpression, 
    indentText 
} from "./constants";
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
    hasVariables: boolean;

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

        const stringified = this.commaStringify();

        this.isZero = stringified === '0';

        this.isOne = stringified === '1';

        this.hasVariables = !!stringified.match(/[a-i]/);

        operator === Operator.Add && this.sortElements();
    }

    sortElements() {
        this.elements.sort((a, b) => {
            return a.stringify().replace(/-/g, '').localeCompare(b.stringify().replace(/-/g, ''))
        });
    }

    commaStringify(dontFindFraction: boolean = false) {
        const string = this.algebraicStringify(dontFindFraction).replace('.', ',');
        return parenthesisEnglobe(string)
            ? string.substring(1, string.length - 1)
            : string;
    }

    algebraicStringify(dontFindFraction: boolean = false): string {
        switch (this.operator) {
            case Operator.Elevate:
                const base = this.elements[0].algebraicStringify(dontFindFraction);
                const exponent = this.elements[1].algebraicStringify(dontFindFraction);
                return `(${parenthesisEnglobe(base)
                    ? base.substring(1, base.length - 1)
                    : base
                    })${ScalarOperations.superscript(exponent)
                    }`;
            case Operator.Divide:
                return `${this.elements[0].algebraicStringify(dontFindFraction)}/(${[...this.elements].splice(1, this.elements.length - 1).map(a => a.algebraicStringify(dontFindFraction)).join(')/(')}`;
            case Operator.Multiply:
                return `${this.elements.map(a => a.algebraicStringify(dontFindFraction)).join('×')}`;
            case Operator.Add:
                const terms = this.elements.map(a => a.algebraicStringify(dontFindFraction)).map(a => a.startsWith('-') ? a : '+' + a).join('');
                return `(${terms.startsWith('+') ? terms.substring(1, terms.length) : terms})`;
            case Operator.Subtract:
                return `(${this.elements[0].algebraicStringify(dontFindFraction)}-${[...this.elements].splice(1, this.elements.length - 1).map(a => a.algebraicStringify(dontFindFraction)).join('-')})`;
            case Operator.None:
                if (!(this.oneElement instanceof ElementData))
                    throw `${this}.oneElement is not ElementData`;
                return this.oneElement.stringify(0, dontFindFraction);
        }
    }

    stringify(indent: number = 0, delta: number = 0): string {
        return this.oneElement
            ? this.oneElement.stringify(delta || 0)
            : indent !== undefined && delta !== undefined
                ? indentExpression(
                    this.operator + '(',
                    this.elements.map(elem => elem.stringify(indent + delta, delta)),
                    ')',
                    indent,
                    delta
                )
                : (
                    this.operator + '('
                    + this.elements.map(elem => elem.stringify()).join(';') 
                    + ')'
                );
    }

    indentStringify(): string {
        return '\n' + this.stringify(0, 3).substring(3) + '\n';
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
    isZero: boolean;
    isOne: boolean;
    hasVariables: boolean;

    constructor({ variables = [], scalar = 1, unfilteredString }: ElementDataParams) {
        this.scalar = smartToFixed(Number.parseFloat(scalar.toString()));

        this.variables = this.scalar === 0 ? [] : variables;

        this.unfilteredString = unfilteredString;

        const stringified = this.stringify();

        this.isZero = stringified === '0';

        this.isOne = stringified === '1';

        this.hasVariables = !!stringified.match(/[a-i]/);

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

    commaStringify(dontFindFraction: boolean = false) {
        return this.stringify(0, dontFindFraction).replace('.', ',');
    }

    stringify(indent: number = 0, dontFindFraction: boolean = false) {

        if (!!this.unfilteredString) return this.unfilteredString;

        const formatScalar =
            () => dontFindFraction
                ? this.scalar
                : this.variables.length === 0
                    ? findFraction(this.scalar)
                    : this.scalar === -1 
                        ? '-'
                        : this.scalar === 1
                            ? ''
                            : findFraction(this.scalar);
        
        return indentText(
            [formatScalar() + this.stringifyVariables()],
            indent
        );
    }

    stringifyVariables() {
        const formatExponent =
            (exponent: number) => exponent === 1
                ? ''
                : ScalarOperations.superscript(findFraction(exponent))
        const formatVariables =
            () => this.variables.map(
                vari => `${vari.variable}${formatExponent(vari.exponent)}`
            )
        return formatVariables().join('');
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


import { count, Operator } from "./constants";
import { ElementData, ExpressionData, VariableData } from "./ExpressionClasses";

export function simplifyExpression(expression) {
    return simplifyExpressionAlgorithm(expression);
    // return fixUnnecessaryScalars(simplifiedList);
}


export function getVariables(string) {
    for (let variable of [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
    ]) {
        if (!Number.isNaN(string) && (string || '').toString() !== 'Infinity' && count(string || '', variable, true) > 0) {
            return variable;
        }
    }
    return null;
}

export function isExpressionInstance(element) {
    return element instanceof ExpressionData;
}

export function varOperation(element1, operator, element2) {

    if (!(element1 instanceof ElementData) && !(element1 instanceof ExpressionData))
        console.log('ERRO em varOperation: element1 não é um ElementData: ' + element1)

    if (!(element2 instanceof ElementData) && !(element2 instanceof ExpressionData)) 
        console.log('ERRO em varOperation: element2 não é um ElementData: ' + element2)

    return simplifyExpressionAlgorithm(
        new ExpressionData({
            operator,
            elements: [
                element1,
                element2
            ]
        })
    );
}

function raiseVariablesExponent(variables, exponent) {
    newVariables = [];
    for (let variableData of variables) {
        newVariables.push(
            new VariableData({
                variable: variableData.variable,
                exponent: variableData.exponent * exponent,
            })
        );
    }
    return newVariables;
}

function getIndexOfVariable(simplifiedElements, variablesSearch) {

    function variablesMatch(variables1, variables2) {
        if (variables1.length !== variables2.length) return false;
        else if (variables1.length === 0) return true;
        for (let i = 0; i < variables1.length; i++) {
            let found = false
            for (let j = 0; j < variables2.length; j++) {
                if (
                    variables1[i].variable === variables2[j].variable
                    &&
                    variables1[i].exponent === variables2[j].exponent
                ) found = true;
            }
            if (!found) return false;
        }
        return true;
    }

    console.log(JSON.stringify({variablesSearch, simplifiedElements}));

    for (let index = 0; index < simplifiedElements.length; index++) {

        console.log({aaa: simplifiedElements[index].variables, index})

        if (variablesMatch(simplifiedElements[index].variables, variablesSearch)) return index;

    }

    return -1;
}

function distributiveMultiplication(distributives) {

    while (distributives.length > 1) {

        let biDistribution = []
    
        for (distElement1 of distributives.shift()) {
            for (distElement2 of distributives.shift()) {
                biDistribution.push(
                    doOperation(
                        new ExpressionData({
                            operator: Operator.Multiply,
                            elements: [
                                distElement1,
                                distElement2
                            ]
                        })
                    )
                );
            }
        }

        distributives = doOperation(
            new ExpressionData({
                operator: Operator.Add,
                elements: biDistribution
            })
        );

    }

    return distributives[0];

}

function simpleMultiplication(multipliers) {

    console.log(JSON.stringify({multipliers}))

    scalar = 1;
    variables = []

    for (element of multipliers) {

        if (element.scalar === 0)
            return new ElementData({
                scalar: 0,
            });

        scalar *= element.scalar;
        variables = variables.concat(element.variables)

    }

    return new ElementData({
        scalar,
        variables
    });
}

function doOperation(expression) {

    let scalar = null;
    let variables = null;
    let simplifiedElements = null;
    let element = null;
 
    switch (expression.operator) {
        case Operator.Divide:

            scalar = null;
            variables = [];

            for (element of expression.elements) {

                if (element instanceof ExpressionData) {
                    console.log('ERRO em doOperation: Expressão muito complicada.')
                    // console.log(JSON.stringify(expression))
                    expression.isSimplified = true;
                    return expression;
                }

                if (element.scalar === 0) {
                    if (scalar !== null) {
                        console.log('ERRO em doOperation: Divisão por zero.')
                        return new ElementData({
                            variables: [
                                new VariableData({
                                    variable: 'ERRO'
                                })
                            ]
                        });
                    } else 
                        return new ElementData({
                            scalar: 0,
                        });
                }

                if (scalar === null) {
                    scalar = element.scalar;
                    variables = variables.concat(element.variables);
                }
                else {
                    scalar /= element.scalar;
                    variables = variables.concat(raiseVariablesExponent(element.variables, -1))
                }
                    
            }

            console.log(JSON.stringify({
                scalar,
                variables
            }))

            return new ElementData({
                scalar,
                variables
            });

        case Operator.Multiply:

            let multipliers = [];
            let distributives = [];

            for (let multiplierIndex = 0; multiplierIndex < expression.elements.length; multiplierIndex++) {

                // Se expression.elements[multiplierIndex] for um ExpressionData:
                if (expression.elements[multiplierIndex] instanceof ExpressionData) {

                    if (expression.elements[multiplierIndex].operator === Operator.Add)
                        distributives.push(expression.elements[multiplierIndex])

                    else if (expression.elements[multiplierIndex].operator === Operator.Multiply)
                        multipliers.concat(expression.elements[multiplierIndex].elements)
                    
                    else {
                        console.log('ERRO em doOperation: um dos multiplicadores não é aceitável: ' + expression.elements[multiplierIndex].operator);
                        multipliers.push(
                            new ElementData({
                                variables: [
                                    'ERRO'
                                ]
                            })
                        );
                    }

                } 
                
                // Se expression.elements[multiplierIndex] for um ElementData:
                else
                    multipliers.push(expression.elements[multiplierIndex])

            }

            let multipliersResult = simpleMultiplication(multipliers);

            if (distributives.length === 0)
                return multipliersResult;

            console.log(JSON.stringify({distributives}))
            
            let simplifiedDistributives = distributiveMultiplication(distributives);

            console.log(simplifiedDistributives)

            if (simplifiedDistributives instanceof ExpressionData) {
                let finalResult = []
                for (let distr of simplifiedDistributives.elements) {
                    finalResult.push(
                        simpleMultiplication([
                            multipliersResult,
                            distr
                        ])
                    );
                }

                return new ExpressionData({
                    operator: Operator.Add,
                    elements: finalResult,
                    isSimplified: true
                });
            }

            return simpleMultiplication([
                multipliersResult,
                simplifiedDistributives
            ]);

        case Operator.Add:

            simplifiedElements = [];

            scalar = 0;
            variables = null;

            for (element of expression.elements) {

                if (element instanceof ExpressionData) {
                    if (element.operator === expression.operator) {
                        return doOperation(
                            new ExpressionData({
                                operator: expression.operator,
                                elements: [...element.elements, ...expression.elements]
                            })
                        );
                    }
                    else {
                        console.log('ERRO em doOperation: Expressão muito complicada.')
                        // console.log(JSON.stringify(expression))
                        expression.isSimplified = true;
                        return expression;
                    }
                }

                if (element.scalar !== 0) {
                    const usedVariablesIndex = getIndexOfVariable(simplifiedElements, element.variables);

                    console.log({usedVariablesIndex})

                    if (usedVariablesIndex === -1)
                        simplifiedElements.push(element);
                    else {
                        simplifiedElements[usedVariablesIndex] = new ElementData({
                            scalar: Number.parseFloat(simplifiedElements[usedVariablesIndex].scalar)
                                + Number.parseFloat(element.scalar),
                            variables: element.variables,
                        });
                    }
                    
                }

            }

            if (simplifiedElements.length === 0)
                simplifiedElements = [
                    new ElementData({
                        scalar: 0
                    })
                ];

            if (simplifiedElements.length === 1) {
                if (simplifiedElements[0].scalar === 0)
                    return new ElementData({
                        scalar: 0
                    })
                return simplifiedElements[0];
            }
            
            return new ExpressionData({
                operator: expression.operator,
                elements: simplifiedElements,
                isSimplified: true
            });

        case Operator.Subtract:

            simplifiedElements = [];

            scalar = 0;
            variables = null;

            for (element of expression.elements) {

                if (element instanceof ExpressionData) {
                    console.log('ERRO em doOperation: Expressão muito complicada.')
                    // console.log(JSON.stringify(expression))
                    expression.isSimplified = true;
                    return expression;
                }

                if (element.scalar !== 0) {
                    const usedVariablesIndex = getIndexOfVariable(simplifiedElements, element.variables);

                    console.log({usedVariablesIndex})

                    if (usedVariablesIndex === -1)
                        simplifiedElements.push(element);
                    else {
                        simplifiedElements[usedVariablesIndex] = new ElementData({
                            scalar: Number.parseFloat(simplifiedElements[usedVariablesIndex].scalar)
                                - Number.parseFloat(element.scalar),
                            variables: element.variables,
                        });
                    }
                    
                }

            }

            if (simplifiedElements.length === 0)
                simplifiedElements = [
                    new ElementData({
                        scalar: 0
                    })
                ];

            if (simplifiedElements.length === 1)
                return simplifiedElements[0];
            
            return new ExpressionData({
                operator: expression.operator,
                elements: simplifiedElements,
                isSimplified: true
            });

        default:
            console.log('ERRO em doOperation: não foi selecionado um operador: ' + expression.operator)
            return 'ERRO';
    }
    
}

function stringifyExpression(expression) {
    return isExpressionInstance(expression)
        ? expression.stringify()
        : expression.toString();
}

function simplifyExpressionAlgorithm(expression) {

    if (isExpressionInstance(expression) && !expression.isSimplified) {
    
        console.log({
            expression: expression.stringify(),
            simplified: expression.isSimplified,
        });

        // Realiza, recursivamente, a simplificação da expressão:
        for (let index = 0; index < expression.elements.length; index++) {
            expression.elements[index] = simplifyExpressionAlgorithm(expression.elements[index]);
        }

        // Após isso, ou a expressão será uma ExpressionData simplificada, ou será uma ElementData:
        expression = doOperation(expression);
    
        console.log({ 
            finalExpression: expression.stringify()
        });

    }
    
    return expression;
}
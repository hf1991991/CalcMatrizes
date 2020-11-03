import ElementDataWithPosition from "../interfaces/ElementDataWithPosition";
import { Operator } from "./constants";
import { createMatrixElement, ElementData, ElementDataParams, ExpressionData, VariableData } from "./ExpressionClasses";

export function simplifyExpression(expression: ExpressionData) {
    return simplifyExpressionAlgorithm(expression);
    // return fixUnnecessaryScalars(simplifiedList);
}

export function isExpressionInstance(element: any) {
    return element instanceof ExpressionData;
}

export function varOperation(
    element1: ExpressionData,
    operator: Operator,
    element2: ExpressionData
) {

    if (!(element1 instanceof ElementData) && !(element1 instanceof ExpressionData))
        console.log('ERRO em varOperation: element1 não é um ElementData: ' + element1)

    if (!(element2 instanceof ElementData) && !(element2 instanceof ExpressionData))
        console.log('ERRO em varOperation: element2 não é um ElementData: ' + element2)

    const expressionData = new ExpressionData({
        operator,
        elements: [
            element1,
            element2
        ]
    });

    // console.log(JSON.stringify({expressionData}))

    const result = simplifyExpressionAlgorithm(expressionData);

    // console.log(JSON.stringify({
    //     element1: element1.stringify(), 
    //     operator, 
    //     element2: element2.stringify(),
    //     result: result.stringify()
    // }));

    return result;
}

function raiseVariablesExponent(variables: Array<VariableData>, exponent: number) {
    let newVariables: Array<VariableData> = [];
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

function additionMatches(
    elements1: ExpressionData | ElementData,
    elements2: ExpressionData | ElementData
) {
    return elements1.stringify() === elements2.stringify();
    // if (elements1.length !== elements2.length) return false;
    // else if (elements1.length === 0) return true;
    // for (let i = 0; i < elements1.length; i++) {
    //     let found = false
    //     for (let j = 0; j < elements2.length; j++) {
    //         if (
    //             elements1[i].scalar === elements2[j].scalar
    //             &&
    //             variablesMatch(elements1[i].variables, elements2[i].variables)
    //         ) found = true;
    //     }
    //     if (!found) return false;
    // }
    // return true;
}

function normalizeAddition(addition: ExpressionData) {

    // console.log({addition});

    const normalizationFactor = (addition.elements[0] instanceof ExpressionData
        ? 1
        : addition.elements[0].scalar) as number;

    return {
        normalizedAddition: createMatrixElement({
            operator: Operator.Add,
            elements: addition.elements.map(
                elem => elem instanceof ExpressionData
                    ? createMatrixElement({
                        operator: Operator.Multiply,
                        elements: [
                            createMatrixElement({
                                scalar: 1 / normalizationFactor
                            }),
                            elem
                        ]
                    })
                    : createMatrixElement({
                        scalar: (elem.scalar as number) / normalizationFactor,
                        variables: elem.variables
                    })
            )
        }),
        normalizationFactor
    };

}

function getIndexOfMultipliableAddition(additionElements: Array<ExpressionData>, additionSearch: ExpressionData) {

    // console.log(JSON.stringify({previousAdditionSearch: additionSearch.stringify(), previousAdditionElements: additionElements.map(e => e.stringify())}));

    const normalizedSearchData = normalizeAddition(additionSearch);

    const normalizedElementsData = additionElements.map(
        elem => normalizeAddition(elem)
    );

    const index = getIndexOfAddition(
        normalizedElementsData.map(e => e.normalizedAddition),
        normalizedSearchData.normalizedAddition
    );

    return {
        index,
        searchNormalizationFactor: normalizedSearchData.normalizationFactor,
        elementEliminationFactor: index !== -1
            ? normalizedElementsData[index].normalizationFactor
            : null
    };

}

function getIndexOfAddition(additionElements: Array<ExpressionData>, additionSearch: ExpressionData) {

    // console.log(JSON.stringify({additionSearch: additionSearch.stringify(), additionElements: additionElements.map(e => e.stringify())}));

    for (let index = 0; index < additionElements.length; index++) {

        if (additionElements[index].operator !== Operator.Add) {
            console.log('ERRO em getIndexOfAddition: operação não é de adição: ' + additionElements[index].operator);
            return -1;
        }

        // console.log({bbb: additionElements[index], index})

        if (additionMatches(additionElements[index], additionSearch)) return index;

    }

    return -1;
}

function variablesMatch(variables1: ExpressionData | ElementData, variables2: ExpressionData | ElementData) {
    return variables1.stringify({ onlyVariables: true }) === variables2.stringify({ onlyVariables: true });
    // if (variables1.length !== variables2.length) return false;
    // else if (variables1.length === 0) return true;
    // for (let i = 0; i < variables1.length; i++) {
    //     let found = false
    //     for (let j = 0; j < variables2.length; j++) {
    //         if (
    //             variables1[i].variable === variables2[j].variable
    //             &&
    //             variables1[i].exponent === variables2[j].exponent
    //         ) found = true;
    //     }
    //     if (!found) return false;
    // }
    // return true;
}

function getIndexOfVariable(simplifiedElements: Array<ExpressionData | ElementData>, variablesSearch: ExpressionData | ElementData) {

    // console.log(JSON.stringify({variablesSearch: variablesSearch, simplifiedElements: simplifiedElements}));

    for (let index = 0; index < simplifiedElements.length; index++) {

        // console.log({aaa: simplifiedElements[index].variables, index})

        if (variablesMatch(simplifiedElements[index], variablesSearch)) return index;

    }

    return -1;
}

function distributiveMultiplication(distributives: Array<ExpressionData | ElementData>) {

    while (distributives.length > 1) {

        let biDistribution = []

        let distrib1 = distributives.shift();
        let distrib2 = distributives.shift();

        distrib1 = distrib1 instanceof ExpressionData
            ? distrib1.elements
            : distrib1;
        distrib2 = distrib2 instanceof ExpressionData
            ? distrib2.elements
            : distrib2;

        for (let distElement1 of distrib1) {
            for (let distElement2 of distrib2) {
                // console.log('ENTERING MULTIPLICATION SUB-LOOP')
                // console.log({distElement1: distElement1.stringify(), distElement2: distElement2.stringify()})
                biDistribution.push(
                    doOperation(
                        createMatrixElement({
                            operator: Operator.Multiply,
                            elements: [
                                distElement1,
                                distElement2
                            ]
                        })
                    )
                );
                // console.log('ENDED MULTIPLICATION SUB-LOOP')
                // console.log({biDistribution: biDistribution.map(a => a.stringify())})
            }
        }

        // console.log('ENTERING ADDITION SUB-LOOP')

        distributives.splice(0, 0, doOperation(
            createMatrixElement({
                operator: Operator.Add,
                elements: biDistribution
            })
        ));

        // console.log('ENDED ADDITION SUB-LOOP')
        // console.log({distributives: distributives.map(a => a.stringify())})


    }

    return distributives[0];

}

function simpleMultiplication(multipliers: Array<ElementData>): ElementData {

    let scalar = 1;
    let variables: Array<VariableData> = []

    for (let element of multipliers) {

        if (element.scalar === 0)
            return new ElementData({
                scalar: 0,
            });

        scalar *= element.scalar;
        variables = [...variables, ...element.variables];

    }

    return new ElementData({
        scalar,
        variables
    });
}

function addNumbersWithSameVariables(adders: Array<ElementData>) {
    // console.log('start')

    let simplifiedElements: Array<ElementData> = [];

    for (let element of adders) {

        if (element.scalar !== 0) {
            const usedVariablesIndex = getIndexOfVariable(simplifiedElements, element);

            // console.log({addIndex: usedVariablesIndex})

            if (usedVariablesIndex === -1)
                simplifiedElements.push(element);
            else
                simplifiedElements[usedVariablesIndex] = new ElementData({
                    scalar: Number.parseFloat(simplifiedElements[usedVariablesIndex].scalar.toString())
                        + Number.parseFloat(element.scalar.toString()),
                    variables: simplifiedElements[usedVariablesIndex].scalar === 0 && element.scalar === 0
                        ? []
                        : element.variables,
                });

        }

    }
    // console.log('finish')

    return simplifiedElements;

}

function symplifyDenominators(addition: ExpressionData) {

    function separateNumeratorsAndDenominators(elem) {

        numerator = null;
        denominators = [];

        if (!(elem instanceof ExpressionData && elem.operator === Operator.Multiply))
            return {
                numerator,
                denominators
            };

        for (let e of elem.elements) {
            // console.log(JSON.stringify({e}))
            if (e instanceof ExpressionData && e.operator === Operator.Elevate && e.elements[1].scalar < 0)
                denominators.push(e);
            else {

                if (numerator !== null) {
                    console.log('ERRO em separateNumeratorsAndDenominators: há mais de um numerador em ' + elem.stringify())
                    numerator = createMatrixElement({
                        variables: [
                            new VariableData({
                                variable: 'ERRO'
                            })
                        ]
                    });
                }

                else {
                    numerator = e;
                }

            }
        }

        return {
            numerator,
            denominators
        };

    }

    function denominatorsMatch(denominators1: Array<ExpressionData>, denominators2: Array<ExpressionData>) {

        for (let denominator1 of denominators1) {

            let match = false;

            for (let denominator2 of denominators2) {
                if (
                    additionMatches(denominator1.elements[0], denominator2.elements[0])
                    && (denominator1.elements[1] as ElementData).scalar === (denominator2.elements[1] as ElementData).scalar
                ) match = true;
            }

            if (!match) return false;

        }

        return true;

    }

    function inverseDistributive(numerator1: ElementData, numerator2: ElementData, denominator: ExpressionData) {

        function addToExponent(variableData: VariableData, add: number) {
            return new VariableData({
                variable: variableData.variable,
                exponent: variableData.exponent + add
            });
        }

        function insertNotExistingVariables(element: ElementData, allVariables: Array<string>) {
            // console.log({element: element.stringify(), allVariables})
            return {
                scalar: element.scalar,
                variables: allVariables.map(
                    v => ({
                        variable: v,
                        exponent: getVariableFromElement(
                            v,
                            element
                        ) || 0
                    })
                )
            };
        }

        function getVariableFromElement(variable: string, element: ElementData) {
            const list = element.variables.filter(
                vari => vari.variable === variable
            );
            return list.length !== 0
                ? list[0]
                : null;
        }

        function getVariableIndex(search: string, variables: Array<VariableData>) {
            return variables.some(v => v.variable === search);
        }

        // console.log('STARTED INVERSE DISTRIBUTIVE')

        const denominatorBase = denominator.elements[0] as ExpressionData;
        const denominatorExponent = (denominator.elements[1] as ElementData).scalar;

        // console.log({
        //     numerator1: numerator1.stringify(),
        //     numerator2: numerator2.stringify(),
        //     denominatorBase: denominatorBase.stringify()
        // });

        let allVariables = [
            ...numerator1.variables,
            ...numerator2.variables,
            ...(denominatorBase.elements[0] as ElementData).variables,
            ...(denominatorBase.elements[1] as ElementData).variables
        ].map(v => v.variable);

        allVariables = allVariables.filter(
            (v, index) => allVariables.indexOf(v) === index
        );

        let denominatorBaseElementsCopy = denominatorBase.elements.map(
            e => insertNotExistingVariables(e, allVariables)
        );

        for (let denominatorElement of denominatorBaseElementsCopy) {

            let numerator1Copy = insertNotExistingVariables(numerator1, allVariables);
            let numerator2Copy = insertNotExistingVariables(numerator2, allVariables);

            // console.log(JSON.stringify({
            //     numerator1Copy: createMatrixElement(numerator1Copy).stringify(),
            //     numerator2Copy: createMatrixElement(numerator2Copy).stringify(),
            //     denominatorBaseElementsCopy: denominatorBaseElementsCopy.map(
            //         e => createMatrixElement(e).stringify()
            //     ),
            //     allVariables
            // }));

            let common = {
                scalar: numerator1Copy.scalar / denominatorElement.scalar,
                variables: []
            };

            numerator1Copy.scalar = numerator1Copy.scalar * Math.pow(common.scalar, -1);
            numerator2Copy.scalar = numerator2Copy.scalar * Math.pow(common.scalar, -1);

            for (let variable of allVariables) {

                let denominatorVariable = getVariableFromElement(variable, denominatorElement);

                let i = getVariableIndex(variable, numerator1Copy.variables);
                let j = getVariableIndex(variable, numerator2Copy.variables);

                if (i === -1 || j === -1) {
                    console.log('ERRO em inverseDistributive: índice não existe.')
                    console.log({ i, j });
                }

                while (numerator1Copy.variables[i].exponent !== denominatorVariable.exponent) {

                    const numberToAdd = numerator1Copy.variables[i].exponent < denominatorVariable.exponent
                        ? 1
                        : -1;

                    numerator1Copy.variables[i] = addToExponent(numerator1Copy.variables[i], numberToAdd);
                    numerator2Copy.variables[j] = addToExponent(numerator2Copy.variables[j], numberToAdd);

                    (common as ElementDataParams).variables?.push(new VariableData({
                        variable,
                        exponent: -1 * numberToAdd
                    }));

                }

            }

            // console.log(JSON.stringify({
            //     numerator1Copy: createMatrixElement(numerator1Copy).stringify(),
            //     numerator2Copy: createMatrixElement(numerator2Copy).stringify(),
            //     denominatorBaseElementsCopy: denominatorBaseElementsCopy.map(
            //         e => createMatrixElement(e).stringify()
            //     ),
            //     common: createMatrixElement(common).stringify()
            // }));

            const newNumerator = createMatrixElement({
                operator: Operator.Add,
                elements: [
                    createMatrixElement(numerator1Copy),
                    createMatrixElement(numerator2Copy)
                ]
            });

            // Se for verdade, foi encontrado o resultado da divisão entre o numerador e denominador:
            if (additionMatches(newNumerator, denominatorBase)) {

                // console.log('ENCONTRADO!')

                const commonElement = new ElementData(common);

                const finalDenominator = doOperation(
                    createMatrixElement({
                        operator: Operator.Elevate,
                        elements: [
                            denominatorBase,
                            createMatrixElement({
                                scalar: 1 + denominatorExponent
                            })
                        ]
                    })
                );

                // console.log({
                //     commonElement: commonElement.stringify(),
                //     finalDenominator: finalDenominator.stringify()
                // })

                // console.log('ENDED INVERSE DISTRIBUTIVE')

                if (1 + denominatorExponent === 0)
                    return commonElement;

                if (commonElement.scalar === 1 && commonElement.variables.length === 0)
                    return finalDenominator;

                return createMatrixElement({
                    operator: Operator.Multiply,
                    elements: [
                        commonElement,
                        finalDenominator
                    ]
                });

            }
            // else
            // console.log('NÃO ENCONTRADO...')

        }

        // console.log('ENDED INVERSE DISTRIBUTIVE')

        return null;

    }

    let newElements: Array<ElementData> = [];
    let addedIndexes: Array<number> = [];

    // console.log('STARTING SYMPLIFYDENOMINATORS')
    // console.log(JSON.stringify({
    //     elementsss: addition.elements.map(a => a.stringify())
    // }));

    for (let i = 0; i < addition.elements.length; i++) {

        const fraction1 = separateNumeratorsAndDenominators(addition.elements[i]);

        // Testa todos os elementos de newElements antes e depois do índice i:
        for (let j = i + 1; j < addition.elements.length; j++) {

            if (!addedIndexes.includes(i) && !addedIndexes.includes(j)) {

                const fraction2 = separateNumeratorsAndDenominators(addition.elements[j]);

                // Verifica se os denominadores são iguais:
                if (
                    denominatorsMatch(fraction1.denominators, fraction2.denominators)
                    && fraction1.denominators.length > 0
                    && fraction2.denominators.length > 0
                ) {

                    if (fraction1.denominators.length > 1) {
                        console.log('ERRO em inverseDistributive: fraction1.denominators muito longo: ' + fraction1.denominators)
                    }

                    const divisionResult = inverseDistributive(fraction1.numerator, fraction2.numerator, fraction1.denominators[0])

                    if (divisionResult !== null) {

                        newElements.push(divisionResult);
                        addedIndexes.push(i);
                        addedIndexes.push(j);

                    }

                }
            }
        }

    }

    for (let index = 0; index < addition.elements.length; index++) {
        if (!addedIndexes.includes(index))
            newElements.push(addition.elements[index]);
    }

    newElements = addNumbersWithSameVariables(newElements).filter(e => !(e.scalar === 0 && e.variables.length === 0));

    // console.log('ENDED SYMPLIFYDENOMINATORS')
    // console.log(JSON.stringify({
    //     newElements: newElements.map(a => a.stringify())
    // }));

    return createMatrixElement({
        operator: Operator.Add,
        elements: newElements,
        isSimplified: true
    })

}

function doOperation(expression: ExpressionData): ExpressionData {

    let element = null;

    console.log(JSON.stringify({ expression }));

    switch (expression.operator) {
        case Operator.Elevate:

            if (expression.elements.length !== 2) {
                console.log('ERRO em doOperation: expressão de elevado não possui dois elementos.');
                return createMatrixElement({
                    variables: [
                        new VariableData({
                            variable: 'ERRO'
                        })
                    ]
                });
            }

            let base = expression.elements[0];
            let exponent = (expression.elements[1] as ElementData).scalar;

            // console.log(JSON.stringify({base, picles: exponent, jacaSeca: expression.elements[1]}))

            if (base instanceof ElementData)
                return createMatrixElement({
                    scalar: Math.pow((base as ElementData).scalar as number, exponent),
                    variables: raiseVariablesExponent(base.variables, exponent)
                })

            if (base.operator === Operator.Elevate)
                return doOperation(
                    createMatrixElement({
                        operator: Operator.Elevate,
                        elements: [
                            base.elements[0],
                            createMatrixElement({
                                scalar: ((base.elements[1] as ElementData).scalar as number) * (exponent as number)
                            })
                        ]
                    })
                );

            if (exponent === 0)
                return createMatrixElement({
                    scalar: 1
                });

            if (exponent === 1)
                return base;

            return createMatrixElement({
                operator: expression.operator,
                elements: expression.elements,
                isSimplified: true,
            })

        case Operator.Divide:

            if (expression.elements.length !== 2)
                throw 'Division should only be applied to two elements'

            const [numerator, denominator] = expression.elements;

            let invertedDenominator;

            if (!!denominator.oneElement) {
                const { scalar, variables } = denominator.oneElement;

                if (scalar === 0)
                    throw 'ERRO em doOperation: divisão por zero.';

                invertedDenominator = createMatrixElement({
                    scalar: 1 / scalar,
                    variables: raiseVariablesExponent(variables, -1)
                });
            }

            else
                invertedDenominator = doOperation(
                    createMatrixElement({
                        operator: Operator.Elevate,
                        elements: [
                            denominator,
                            createMatrixElement({
                                scalar: -1
                            })
                        ]
                    })
                );

            const multiplicationElements = [numerator, invertedDenominator];

            return doOperation(
                createMatrixElement({
                    operator: Operator.Multiply,
                    elements: multiplicationElements
                })
            );

        case Operator.Multiply:

            let oneElements: Array<ElementData> = [];
            let distributives: Array<ExpressionData> = [];
            let elevations: Array<ExpressionData> = [];

            for (let multiplier of expression.elements) {

                switch (multiplier.operator) {
                    case Operator.Add:
                        distributives.push(multiplier);
                        break;
                    case Operator.Multiply:
                        for (let elem of multiplier.elements) {
                            if (elem instanceof ElementData)
                                oneElements.push(elem);

                            else if (elem.operator === Operator.Elevate)
                                elevations.push(elem);

                            else if (elem.operator === Operator.Add)
                                distributives.push(elem);
                        }
                        break;
                    case Operator.Elevate:
                        elevations.push(multiplier);
                        break;
                    case Operator.None:
                        oneElements.push(multiplier.oneElement as ElementData);
                        break;
                    default:
                        throw 'ERRO em doOperation: um dos multiplicadores não é aceitável: ' + multiplier.operator;
                }

            }

            let oneElementsResult = simpleMultiplication(oneElements);

            if (
                (distributives.length === 0 && elevations.length === 0)
                || oneElementsResult.scalar === 0
            )
                return new ExpressionData({
                    oneElement: oneElementsResult
                });

            let simplifiedElevations = [];

            for (let elevationElement of elevations) {

                const baseExpression = elevationElement.elements[0];
                const exponentExpression = elevationElement.elements[1];

                if (!exponentExpression.oneElement)
                    throw 'exponentExpression is not oneElement';

                const exponent = exponentExpression.oneElement.scalar;

                const distributivesCopyData = getIndexOfMultipliableAddition(distributives, baseExpression);
                const elevationsCopyData = getIndexOfMultipliableAddition(
                    simplifiedElevations.map(elem => elem.elements[0]),
                    baseExpression
                );

                // console.log({distributivesCopyData, elevationsCopyData})

                if (distributivesCopyData.index !== -1) {

                    const multiplier = createMatrixElement({
                        scalar: distributivesCopyData.searchNormalizationFactor
                            * Math.pow(distributivesCopyData.elementEliminationFactor, exponent)
                    });

                    const normalizedDistributive = normalizeAddition(
                        distributives.splice(distributivesCopyData.index)[0]
                    ).normalizedAddition

                    // console.log({normalizedDistributive: normalizedDistributive.stringify()})

                    const normalizedMultipliedBase = doOperation(
                        createMatrixElement({
                            operator: Operator.Elevate,
                            elements: [
                                normalizedDistributive,
                                createMatrixElement({
                                    scalar: exponent + 1
                                }),
                            ]
                        })
                    );

                    if (multiplier.scalar === 1) {

                        const newElement = normalizedMultipliedBase;

                        // console.log({newElement: newElement.stringify()})

                        if (newElement instanceof ElementData)
                            oneElementsResult = simpleMultiplication([
                                oneElementsResult,
                                newElement
                            ]);

                        else
                            simplifiedElevations.push(newElement);

                    }

                    else {

                        if (normalizedMultipliedBase instanceof ElementData)
                            oneElementsResult = simpleMultiplication([
                                multiplier,
                                oneElementsResult,
                                newElement
                            ]);

                        else {

                            newElement = createMatrixElement({
                                operator: Operator.Multiply,
                                elements: [
                                    multiplier,
                                    normalizedMultipliedBase
                                ]
                            });

                            simplifiedElevations.push(newElement);
                        }

                    }

                }

                if (elevationsCopyData.index !== -1) {

                    multiplier = createMatrixElement({
                        scalar: elevationsCopyData.searchNormalizationFactor
                            * Math.pow(elevationsCopyData.elementEliminationFactor, exponent)
                    });

                    normalizedMultipliedBase = doOperation(
                        createMatrixElement({
                            operator: Operator.Elevate,
                            elements: [
                                normalizeAddition(
                                    elevations.splice(elevationsCopyData.index)[0].elements[0]
                                ).normalizedAddition,
                                createMatrixElement({
                                    scalar: exponent + 1
                                }),
                            ]
                        })
                    );

                    if (multiplier.scalar === 1) {

                        newElement = normalizedMultipliedBase;

                        if (newElement instanceof ElementData)
                            oneElementsResult = simpleMultiplication([
                                oneElementsResult,
                                newElement
                            ]);

                        else
                            simplifiedElevations.push(newElement);

                    }

                    else {

                        if (normalizedMultipliedBase instanceof ElementData)
                            oneElementsResult = simpleMultiplication([
                                multiplier,
                                oneElementsResult,
                                newElement
                            ]);

                        else {

                            newElement = createMatrixElement({
                                operator: Operator.Multiply,
                                elements: [
                                    multiplier,
                                    normalizedMultipliedBase
                                ]
                            });

                            simplifiedElevations.push(newElement);
                        }

                    }

                }

                if (distributivesCopyData.index === -1 && elevationsCopyData.index === -1)
                    simplifiedElevations.push(elevationElement);

            }

            if (distributives.length === 0) {

                if (simplifiedElevations.length === 0) {
                    // console.log(2)
                    return oneElementsResult;
                }

                if (!(oneElementsResult.scalar === 1 && oneElementsResult.variables.length === 0)) {
                    // console.log(3)
                    return createMatrixElement({
                        operator: Operator.Multiply,
                        elements: [oneElementsResult, ...simplifiedElevations],
                        isSimplified: true
                    });
                }

                if (simplifiedElevations.length === 1) {
                    // console.log(4)
                    return simplifiedElevations[0]
                }

                // console.log(5)
                return createMatrixElement({
                    operator: Operator.Multiply,
                    elements: simplifiedElevations,
                    isSimplified: true
                });

            }

            // console.log(JSON.stringify({distributives}))

            let simplifiedDistributives = distributiveMultiplication(distributives);

            // console.log(JSON.stringify({simplifiedDistributives: simplifiedDistributives.stringify()}))

            // Se simplifiedDistributives for um ExpressionData, com operador Add:
            if (simplifiedDistributives instanceof ExpressionData) {
                let finalResult = []
                for (let distr of simplifiedDistributives.elements) {

                    // console.log('ENTERING MULT MULTIPLICATION SUB-LOOP')
                    // console.log({
                    //     multipliersResult: multipliersResult.stringify(),
                    //     distr: distr.stringify()
                    // });
                    const mult = doOperation(
                        createMatrixElement({
                            operator: Operator.Multiply,
                            elements: [
                                oneElementsResult,
                                distr
                            ]
                        })
                    );
                    // console.log('ENDED MULT MULTIPLICATION SUB-LOOP')
                    // console.log({
                    //     mult: mult.stringify()
                    // });

                    if (simplifiedElevations.length === 0)
                        finalResult.push(mult);

                    else {

                        if (mult.scalar === 0)
                            return createMatrixElement({
                                scalar: 0,
                            });

                        else if (mult.scalar === 1 && mult.variables.length === 0) {
                            if (simplifiedElevations.length === 1)
                                return simplifiedElevations[0];

                            else
                                finalResult.push(
                                    createMatrixElement({
                                        operator: Operator.Multiply,
                                        elements: simplifiedElevations,
                                        isSimplified: true
                                    })
                                );
                        }

                        else {
                            finalResult.push(
                                createMatrixElement({
                                    operator: Operator.Multiply,
                                    elements: [
                                        mult,
                                        ...simplifiedElevations
                                    ],
                                    isSimplified: true
                                })
                            );
                        }

                    }

                }

                // console.log(6)
                return createMatrixElement({
                    operator: Operator.Add,
                    elements: finalResult,
                    isSimplified: true
                });
            }

            oneElementsResult = simpleMultiplication([
                oneElementsResult,
                simplifiedDistributives
            ]);

            if (simplifiedElevations.length === 0) {
                // console.log(7)
                return oneElementsResult;
            }

            if (oneElementsResult === 1) {

                if (simplifiedElevations.length === 1) {
                    // console.log(8)
                    return simplifiedElevations[0];
                }

                // console.log(9)
                return createMatrixElement({
                    operator: operator.Multiply,
                    elements: simplifiedElevations,
                    isSimplified: true
                })

            }

            // console.log(10)
            return createMatrixElement({
                operator: operator.Multiply,
                elements: [
                    oneElementsResult,
                    ...simplifiedElevations
                ],
                isSimplified: true
            })

        case Operator.Add:

            let adders: Array<ElementData> = [];
            let notAdders: Array<ExpressionData> = [];

            // console.log(JSON.stringify({elele: expression.elements}))

            for (let adderElement of expression.elements) {

                if (!adderElement.oneElement) {

                    if (adderElement.operator === Operator.Add) {

                        for (let elem of adderElement.elements) {
                            if (!elem.oneElement)
                                notAdders.push(elem)

                            else if (elem.oneElement.scalar !== 0)
                                adders.push(elem.oneElement);
                        }

                    }

                    else
                        notAdders.push(adderElement)

                }

                else if (adderElement.oneElement.scalar !== 0)
                    adders.push(adderElement.oneElement)

            }

            // console.log({
            //     adders: adders.map(a => a.stringify()),
            //     notAdders: notAdders.map(a => a.stringify())
            // });

            let simplifiedAdders = addNumbersWithSameVariables(
                addNumbersWithSameVariables(adders)
            );

            // console.log({simplifiedAdders, notAdders, adders})

            if (simplifiedAdders.length === 0 && notAdders.length === 0)
                return new ExpressionData({
                    oneElement: new ElementData({
                        scalar: 0
                    })
                });

            if (simplifiedAdders.length === 1 && notAdders.length === 0)
                return new ExpressionData({
                    oneElement: simplifiedAdders[0]
                });

            if (simplifiedAdders.length === 0 && notAdders.length === 1)
                return notAdders[0];

            const expressionAdders = simplifiedAdders.map(
                elem => new ExpressionData({
                    oneElement: elem
                })
            );

            return symplifyDenominators(
                new ExpressionData({
                    operator: expression.operator,
                    elements: [
                        ...expressionAdders,
                        ...notAdders
                    ],
                    isSimplified: true
                })
            );

        case Operator.Subtract:

            elements = []

            first = true;

            for (element of expression.elements) {

                if (first)
                    elements.push(element);

                else {

                    if (element instanceof ExpressionData)
                        elements.push(
                            doOperation(
                                createMatrixElement({
                                    operator: Operator.Multiply,
                                    elements: [
                                        element,
                                        createMatrixElement({
                                            scalar: -1
                                        })
                                    ]
                                })
                            )
                        );

                    else {

                        if (element.scalar !== 0) {

                            elements.push(
                                createMatrixElement({
                                    scalar: -1 * element.scalar,
                                    variables: element.variables
                                })
                            );

                        }

                    }

                }

                first = false;

            }

            return doOperation(
                createMatrixElement({
                    operator: Operator.Add,
                    elements,
                })
            );

        default:
            console.log('ERRO em doOperation: não foi selecionado um operador: ' + expression.operator)
            return 'ERRO';
    }

}

function stringifyExpression(expression: any) {
    return isExpressionInstance(expression)
        ? expression.stringify()
        : expression.toString();
}

function simplifyExpressionAlgorithm(expression: ExpressionData) {
    console.log(JSON.stringify({ expression12: expression }));

    if (!expression.isSimplified) {

        // Realiza, recursivamente, a simplificação da expressão:
        for (let element of expression.elements) {
            element = simplifyExpressionAlgorithm(element);
        }

        // Após isso, realiza a operação:
        expression = doOperation(expression);

    }

    return expression;
}
import { Operator } from "./constants";
import { ElementData, ExpressionData, VariableData } from "./ExpressionClasses";

export function simplifyExpression(expression: ExpressionData) {
    return simplifyExpressionAlgorithm(expression);
    // return fixUnnecessaryScalars(simplifiedList);
}

export function isExpressionInstance(element: any) {
    return element instanceof ExpressionData;
}

export function varOperation(
    element1: ElementData | ExpressionData, 
    operator: Operator, 
    element2: ElementData | ExpressionData
) {

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
    
    const normalizationFactor = (addition.elements[0] instanceof ExpressionData
        ? 1
        : addition.elements[0].scalar) as number;

    return {
        normalizedAddition: new ExpressionData({
            operator: Operator.Add,
            elements: addition.elements.map(
                elem => elem instanceof ExpressionData
                    ? new ExpressionData({
                        operator: Operator.Multiply,
                        elements: [
                            new ElementData({
                                scalar: 1 / normalizationFactor
                            }),
                            elem
                        ]
                    })
                    : new ElementData({
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
                        new ExpressionData({
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
            new ExpressionData({
                operator: Operator.Add,
                elements: biDistribution
            })
        ));

        // console.log('ENDED ADDITION SUB-LOOP')
        // console.log({distributives: distributives.map(a => a.stringify())})


    }

    return distributives[0];

}

function simpleMultiplication(multipliers) {

    // console.log(JSON.stringify({multipliers}))

    let scalar = 1;
    let variables = []

    for (let element of multipliers) {

        if (element.scalar === 0)
            return new ElementData({
                scalar: 0,
            });

        scalar *= element.scalar;
        variables = variables.concat(element.variables)

        // console.log('abacate')
        // console.log(JSON.stringify({scalar, variables}))

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

function symplifyDenominators(addition) {

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
                    numerator = new ElementData({
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

    function denominatorsMatch(denominators1, denominators2) {

        for (let denominator1 of denominators1) {

            match = false;

            for (denominator2 of denominators2) {
                if (
                    additionMatches(denominator1.elements[0], denominator2.elements[0])
                    && denominator1.elements[1].scalar === denominator2.elements[1].scalar
                ) match = true;
            }

            if (!match) return false;

        }

        return true;

    }

    function inverseDistributive(numerator1, numerator2, denominator) {

        function addToExponent(variableData, add) {
            return new VariableData({
                    variable: variableData.variable,
                    exponent: variableData.exponent + add
                });
        }

        function insertNotExistingVariables(element, allVariables) {
            // console.log({element: element.stringify(), allVariables})
            return {
                scalar: element.scalar,
                variables: allVariables.map(
                    v => ({
                        variable: v,
                        exponent: getVariableFromElement(
                                v,
                                element
                            ) !== null
                                ? getVariableFromElement(
                                        v,
                                        element
                                    ).exponent
                                : 0
                    })
                )
            };
        }

        function getVariableFromElement(variable, element) {
            const list = element.variables.filter(
                vari => vari.variable === variable
            );
            return list.length !== 0
                ? list[0]
                : null;
        }

        function getVariableIndex(search, variables) {
            return variables.map(v => v.variable).indexOf(search);
        }

        // console.log('STARTED INVERSE DISTRIBUTIVE')

        const denominatorBase = denominator.elements[0];
        const denominatorExponent = denominator.elements[1].scalar;

        // console.log({
        //     numerator1: numerator1.stringify(),
        //     numerator2: numerator2.stringify(),
        //     denominatorBase: denominatorBase.stringify()
        // });

        let allVariables = [
            ...numerator1.variables,
            ...numerator2.variables,
            ...denominatorBase.elements[0].variables,
            ...denominatorBase.elements[1].variables
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
            //     numerator1Copy: new ElementData(numerator1Copy).stringify(),
            //     numerator2Copy: new ElementData(numerator2Copy).stringify(),
            //     denominatorBaseElementsCopy: denominatorBaseElementsCopy.map(
            //         e => new ElementData(e).stringify()
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
    
                    common.variables.push(new VariableData({
                        variable,
                        exponent: -1 * numberToAdd
                    }));

                }

            }

            // console.log(JSON.stringify({
            //     numerator1Copy: new ElementData(numerator1Copy).stringify(),
            //     numerator2Copy: new ElementData(numerator2Copy).stringify(),
            //     denominatorBaseElementsCopy: denominatorBaseElementsCopy.map(
            //         e => new ElementData(e).stringify()
            //     ),
            //     common: new ElementData(common).stringify()
            // }));

            const newNumerator = new ExpressionData({
                operator: Operator.Add,
                elements: [
                    new ElementData(numerator1Copy),
                    new ElementData(numerator2Copy)
                ]
            });

            // Se for verdade, foi encontrado o resultado da divisão entre o numerador e denominador:
            if (additionMatches(newNumerator, denominatorBase)) {

                // console.log('ENCONTRADO!')

                const commonElement = new ElementData(common);

                const finalDenominator = doOperation(
                    new ExpressionData({
                        operator: Operator.Elevate,
                        elements: [
                            denominatorBase,
                            new ElementData({
                                scalar: 1 + Number.parseFloat(denominatorExponent)
                            })
                        ]
                    })
                );

                // console.log({
                //     commonElement: commonElement.stringify(),
                //     finalDenominator: finalDenominator.stringify()
                // })

                // console.log('ENDED INVERSE DISTRIBUTIVE')

                if (1 + Number.parseFloat(denominatorExponent) === 0)
                    return commonElement;

                if (commonElement.scalar === 1 && commonElement.variables.length === 0)
                    return finalDenominator;
                
                return new ExpressionData({
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

    let newElements = [];
    let addedIndexes = [];

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

    return new ExpressionData({
        operator: Operator.Add,
        elements: newElements,
        isSimplified: true
    })

}

function doOperation(expression: ExpressionData): ExpressionData | ElementData {

    let element = null;
 
    switch (expression.operator) {
        case Operator.Elevate:

            if (expression.elements.length !== 2) {
                console.log('ERRO em doOperation: expressão de elevado não possui dois elementos.');
                return new ElementData({
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
                return new ElementData({
                    scalar: Math.pow((base as ElementData).scalar as number, exponent),
                    variables: raiseVariablesExponent(base.variables, exponent)
                })

            if (base.operator === Operator.Elevate)
                return doOperation(
                    new ExpressionData({
                        operator: Operator.Elevate,
                        elements: [
                            base.elements[0],
                            new ElementData({
                                scalar: ((base.elements[1] as ElementData).scalar as number) * (exponent as number)
                            })
                        ]
                    })
                );

            if (exponent === 0)
                return new ElementData({
                    scalar: 1
                });

            if (exponent === 1)
                return base;

            return new ExpressionData({
                operator: expression.operator,
                elements: expression.elements,
                isSimplified: true,
            })

        case Operator.Divide:

            multiplicationElements = []

            first = true;

            for (element of expression.elements) {

                if (first)
                    multiplicationElements.push(element);

                else {

                    // console.log(JSON.stringify({
                    //     jacaEuropeia: element
                    // }))

                    if (element instanceof ExpressionData) 
                        multiplicationElements.push(
                            doOperation(
                                new ExpressionData({
                                    operator: Operator.Elevate,
                                    elements: [
                                        element,
                                        new ElementData({
                                            scalar: -1
                                        })
                                    ]
                                })
                            )
                        );

                    else {

                        if (element.scalar === 0) {

                            console.log('ERRO em doOperation: divisão por zero.')
                            return new ElementData({
                                variables: [
                                    new VariableData({
                                        variable: 'ERRO'
                                    })
                                ]
                            });

                        }

                        multiplicationElements.push(
                            new ElementData({
                                scalar: 1 / element.scalar,
                                variables: raiseVariablesExponent(element.variables, -1)
                            })
                        );

                    }

                    // console.log({jacaJavanesa: multiplicationElements})

                }

                first = false;
                
            }

            // console.log(JSON.stringify({batata: multiplicationElements}))

            return doOperation(
                new ExpressionData({
                    operator: Operator.Multiply,
                    elements: multiplicationElements
                })
            );

        case Operator.Multiply:

            let multipliers: Array<ExpressionData | ElementData> = [];
            let distributives: Array<ExpressionData | ElementData> = [];
            let elevations: Array<ExpressionData | ElementData> = [];

            // console.log({jacaGrande: expression.stringify()})

            for (let multiplier of expression.elements) {

                // Se multiplier for um ExpressionData:
                if (multiplier instanceof ExpressionData) {

                    if (multiplier.operator === Operator.Add)
                        distributives.push(multiplier)

                    else if (multiplier.operator === Operator.Multiply) {
                        for (let elem of multiplier.elements) {
                            
                            if (elem instanceof ElementData)
                                multipliers.push(elem)

                            else if (elem.operator === Operator.Elevate)
                                elevations.push(elem)

                            else if (elem.operator === Operator.Add)
                                distributives.push(elem)

                        }
                    }
                    
                    else if (multiplier.operator === Operator.Elevate) 
                        elevations.push(multiplier)
                    
                    else {
                        console.log('ERRO em doOperation: um dos multiplicadores não é aceitável: ' + multiplier.operator);
                        multipliers.push(
                            new ElementData({
                                variables: [
                                    new VariableData({
                                        variable: 'ERRO'
                                    })
                                ]
                            })
                        );
                    }

                } 
                
                // Se multiplier for um ElementData:
                else
                    multipliers.push(multiplier)

            }

            // console.log('ganso')
            // console.log(JSON.stringify({
            //     multipliers: multipliers.map(a => a.stringify()), 
            //     elevations: elevations.map(a => a.stringify()), 
            //     distributives: distributives.map(a => a.stringify())
            // }));

            let multipliersResult = simpleMultiplication(multipliers);

            if (
                (distributives.length === 0 && elevations.length === 0)
                || multipliersResult.scalar === 0
            ) {
                // console.log(1)
                return multipliersResult;
            }

            let simplifiedElevations = []

            for (let elevationElement of elevations) {

                base = elevationElement.elements[0];
                exponent = elevationElement.elements[1].scalar;

                const distributivesCopyData = getIndexOfMultipliableAddition(distributives, base);
                const elevationsCopyData = getIndexOfMultipliableAddition(
                    simplifiedElevations.map(elem => elem.elements[0]), 
                    base
                );

                // console.log({distributivesCopyData, elevationsCopyData})

                if (distributivesCopyData.index !== -1) {

                    multiplier = new ElementData({
                        scalar: distributivesCopyData.searchNormalizationFactor
                            * Math.pow(distributivesCopyData.elementEliminationFactor, exponent)
                    });

                    normalizedDistributive = normalizeAddition(
                            distributives.splice(distributivesCopyData.index)[0]
                        ).normalizedAddition

                    // console.log({normalizedDistributive: normalizedDistributive.stringify()})

                    const normalizedMultipliedBase = doOperation(
                        new ExpressionData({
                            operator: Operator.Elevate,
                            elements: [
                                normalizedDistributive,
                                new ElementData({
                                    scalar: exponent + 1
                                }),
                            ]
                        })
                    );

                    if (multiplier.scalar === 1) {

                        newElement = normalizedMultipliedBase; 

                        // console.log({newElement: newElement.stringify()})

                        if (newElement instanceof ElementData)
                            multipliersResult = simpleMultiplication([
                                multipliersResult,
                                newElement
                            ]);
    
                        else
                            simplifiedElevations.push(newElement);

                    }

                    else {

                        if (normalizedMultipliedBase instanceof ElementData)
                            multipliersResult = simpleMultiplication([
                                multiplier,
                                multipliersResult,
                                newElement
                            ]);
    
                        else {

                            newElement = new ExpressionData({
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

                    multiplier = new ElementData({
                        scalar: elevationsCopyData.searchNormalizationFactor
                            * Math.pow(elevationsCopyData.elementEliminationFactor, exponent)
                    });

                    normalizedMultipliedBase = doOperation(
                        new ExpressionData({
                            operator: Operator.Elevate,
                            elements: [
                                normalizeAddition(
                                    elevations.splice(elevationsCopyData.index)[0].elements[0]
                                ).normalizedAddition,
                                new ElementData({
                                    scalar: exponent + 1
                                }),
                            ]
                        })
                    );

                    if (multiplier.scalar === 1) {

                        newElement = normalizedMultipliedBase; 

                        if (newElement instanceof ElementData)
                            multipliersResult = simpleMultiplication([
                                multipliersResult,
                                newElement
                            ]);
    
                        else
                            simplifiedElevations.push(newElement);

                    }

                    else {

                        if (normalizedMultipliedBase instanceof ElementData)
                            multipliersResult = simpleMultiplication([
                                multiplier,
                                multipliersResult,
                                newElement
                            ]);
    
                        else {

                            newElement = new ExpressionData({
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

            // let elevationExponentDict = {};

            // const time = new Date();

            // console.log('STARTING ELEVATION EXPONENT ' + time);
            // console.log(JSON.stringify({
            //     simplifiedElevations: simplifiedElevations.map(a => a.stringify()), 
            // }));

            // for (elevationElement of simplifiedElevations) {
            //     elevationExponentDict[elevationElement.elements[1].scalar] = [
            //         ...(elevationExponentDict[elevationElement.elements[1].scalar] || []), 
            //         elevationElement.elements[0]
            //     ];
            //     console.log({
            //         bases: elevationExponentDict[elevationElement.elements[1].scalar].map(e => e.stringify()),
            //         elevation: elevationElement.elements[1].scalar
            //     })
            // }

            // simplifiedElevations = [];

            // for (elevationExponent of Object.keys(elevationExponentDict)) {
            //     if (elevationExponentDict[elevationExponent].length > 1) {

            //         console.log('STARTING ELEVATION EXPONENT MULT SUB-LOOP ' + time);
            //         console.log({
            //             elevationExponent,
            //             elements: elevationExponentDict[elevationExponent].map(
            //                 e => e.stringify()
            //             )
            //         })
            //         elevationExponentDict[elevationExponent] = [
            //             doOperation(
            //                 new ExpressionData({
            //                     operator: Operator.Multiply,
            //                     elements: elevationExponentDict[elevationExponent]
            //                 })
            //             )
            //         ];
            //         console.log('ENDED ELEVATION EXPONENT MULT SUB-LOOP ' + time);
            //         console.log({
            //             elevationExponent,
            //             elements: elevationExponentDict[elevationExponent]
            //         })
            //     }

            //     for (elevationBase of elevationExponentDict[elevationExponent])
            //         simplifiedElevations.push(new ExpressionData({
            //             operator: Operator.Elevate,
            //             elements: [
            //                 elevationBase,
            //                 new ElementData({
            //                     scalar: elevationExponent
            //                 })
            //             ]
            //         }));
                
            // }

            // console.log('ENDED ELEVATION EXPONENT ' + time);
            // console.log(JSON.stringify({
            //     simplifiedElevations: simplifiedElevations.map(a => a.stringify()), 
            // }));

            // console.log('pesto')
            // console.log(JSON.stringify({
            //     multipliers: multipliers.map(a => a.stringify()), 
            //     elevations: elevations.map(a => a.stringify()), 
            //     distributives: distributives.map(a => a.stringify())
            // }));

            // console.log(JSON.stringify({
            //     simplifiedElevations: simplifiedElevations.map(a => a.stringify()), 
            //     multipliersResult: multipliersResult.stringify()
            // }));
            // console.log(JSON.stringify({simplifiedElevations}))

            if (distributives.length === 0) {

                if (simplifiedElevations.length === 0) {
                    // console.log(2)
                    return multipliersResult;
                }

                if (!(multipliersResult.scalar === 1 && multipliersResult.variables.length === 0)) {
                    // console.log(3)
                    return new ExpressionData({
                        operator: Operator.Multiply,
                        elements: [multipliersResult, ...simplifiedElevations],
                        isSimplified: true
                    });
                }
                
                if (simplifiedElevations.length === 1) {
                    // console.log(4)
                    return simplifiedElevations[0]
                }
                
                // console.log(5)
                return new ExpressionData({
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
                        new ExpressionData({
                            operator: Operator.Multiply,
                            elements: [
                                multipliersResult,
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
                            return new ElementData({
                                scalar: 0,
                            });

                        else if (mult.scalar === 1 && mult.variables.length === 0) {
                            if (simplifiedElevations.length === 1)
                                return simplifiedElevations[0];

                            else
                                finalResult.push(
                                    new ExpressionData({
                                        operator: Operator.Multiply,
                                        elements: simplifiedElevations,
                                        isSimplified: true
                                    })
                                );
                        }

                        else {
                            finalResult.push(
                                new ExpressionData({
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
                return new ExpressionData({
                    operator: Operator.Add,
                    elements: finalResult,
                    isSimplified: true
                });
            }

            multipliersResult = simpleMultiplication([
                multipliersResult,
                simplifiedDistributives
            ]);

            if (simplifiedElevations.length === 0) {
                // console.log(7)
                return multipliersResult;
            }

            if (multipliersResult === 1) {

                if (simplifiedElevations.length === 1) {
                    // console.log(8)
                    return simplifiedElevations[0];
                }

                // console.log(9)
                return new ExpressionData({
                    operator: operator.Multiply,
                    elements: simplifiedElevations,
                    isSimplified: true
                })

            }

            // console.log(10)
            return new ExpressionData({
                operator: operator.Multiply,
                elements: [
                    multipliersResult,
                    ...simplifiedElevations
                ],
                isSimplified: true
            })

        case Operator.Add:

            let adders = [];
            let notAdders = [];

            for (let adderElement of expression.elements) {

                // Se adderElement for um ExpressionData:
                if (adderElement instanceof ExpressionData) {

                    if (adderElement.operator === Operator.Add) {

                        for (let elem of adderElement.elements) {
                            if (elem instanceof ElementData && elem.scalar !== 0) 
                                adders.push(elem)

                            else
                                notAdders.push(elem)
                        }

                    }
                    
                    else
                        notAdders.push(adderElement)

                } 
                
                // Se adderElement for um ElementData:
                else if (adderElement.scalar !== 0)
                    adders.push(adderElement)

            }

            // console.log({
            //     adders: adders.map(a => a.stringify()),
            //     notAdders: notAdders.map(a => a.stringify())
            // });

            let simplifiedAdders = addNumbersWithSameVariables(
                addNumbersWithSameVariables(adders)
            );

            if (simplifiedAdders.length === 0 && notAdders.length === 0)
                simplifiedAdders = [
                    new ElementData({
                        scalar: 0
                    })
                ];

            if (simplifiedAdders.length === 1 && notAdders.length === 0) {
                if (simplifiedAdders[0].scalar === 0)
                    return new ElementData({
                        scalar: 0
                    })
                return simplifiedAdders[0];
            }

            if (simplifiedAdders.length === 0 && notAdders.length === 1)
                return notAdders[0];
            
            return symplifyDenominators(
                new ExpressionData({
                    operator: expression.operator,
                    elements: [
                        ...simplifiedAdders,
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
                                new ExpressionData({
                                    operator: Operator.Multiply,
                                    elements: [
                                        element,
                                        new ElementData({
                                            scalar: -1
                                        })
                                    ]
                                })
                            )
                        );

                    else {

                        if (element.scalar !== 0) {

                            elements.push(
                                new ElementData({
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
                new ExpressionData({
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

function simplifyExpressionAlgorithm(expression: ExpressionData | ElementData) {

    if (isExpressionInstance(expression) && !(expression as ExpressionData).isSimplified) {
        expression = expression as ExpressionData;
    
        // console.log({
        //     expression: expression.stringify(),
        //     simplified: expression.isSimplified,
        // });

        // Realiza, recursivamente, a simplificação da expressão:
        for (let index = 0; index < expression.elements.length; index++) {
            expression.elements[index] = simplifyExpressionAlgorithm(expression.elements[index]);
        }

        // Após isso, ou a expressão será uma ExpressionData simplificada, ou será uma ElementData:
        expression = doOperation(expression);

        // console.log(JSON.stringify({
        //     finalExpression: expression.stringify()
        // }))

    }
    
    return expression;
}
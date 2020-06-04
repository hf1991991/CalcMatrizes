import React from 'react';
import { View, Text } from 'react-native';
import Matrix from './Matrix';
import EquationData from '../utilities/EquationData';

const OPERATORS_WIDTH = 40;
const X_OPERATOR_WIDTH = 20;

export default function FullEquation({ 
    fullEquation,
    totalMaxAreaWidth,
}) {

    function XOperator() {
        return (
            <Text
                style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 30,
                    top: 2,
                    width: X_OPERATOR_WIDTH,
                }}
            >
                X
            </Text>
        );
    }

    const equationData = new EquationData(fullEquation);
    const singleMatrixMaxWidth = (
            totalMaxAreaWidth 
            - equationData.getQuantityOfOperators() * OPERATORS_WIDTH
            - equationData.hasXOperator() * X_OPERATOR_WIDTH
        ) 
        / equationData.getQuantityOfMatrices();

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            {
                equationData.matrix1 
                    ? (
                        <Matrix 
                            maxMatrixWidth={singleMatrixMaxWidth}
                            matrixNumbers={equationData.matrix1}
                        />
                    )
                    : equationData.variablePosition === 1
                        && <XOperator />
            }
            {
                equationData.firstOperator && (
                    <Text
                        style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: 35,
                            width: OPERATORS_WIDTH,
                        }}
                    >
                        {equationData.firstOperator}
                    </Text>
                )
            }
            {
                equationData.matrix2 
                    ? (
                        <Matrix 
                            maxMatrixWidth={singleMatrixMaxWidth}
                            matrixNumbers={equationData.matrix2}
                        />
                    )
                    : equationData.variablePosition === 2
                        &&  <XOperator />
            }
            {
                equationData.secondOperator && (
                    <Text
                        style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: 35,
                            width: OPERATORS_WIDTH,
                        }}
                    >
                        {equationData.secondOperator}
                    </Text>
                )
            }
            {
                equationData.matrix3 
                    ? (
                        <Matrix 
                            maxMatrixWidth={singleMatrixMaxWidth}
                            matrixNumbers={equationData.matrix3}
                        />
                    )
                    : equationData.variablePosition === 3
                        &&  <XOperator />
            }
        </View>
    );
}
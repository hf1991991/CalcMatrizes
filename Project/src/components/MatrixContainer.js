import React from 'react';
import { View, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const HorizontalLines = () => (
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}
    >
        <View 
            style={{
                width: 15,
                height: 3,
                backgroundColor: '#fff',
            }}
        />
        <View 
            style={{
                width: 15,
                height: 3,
                backgroundColor: '#fff',
            }}
        />
    </View>
);

export default function MatrixColumns({ matrixColumns }) {
    return (
        <View
            style={{
                justifyContent: 'center',
                // Largura máxima da matrix é restringida pelo tamanho dos botões de seta (50) e paddingHorizontal de InfoArea (20):
                maxWidth: windowWidth - (50 + 20)*2,
            }}
        >
            <HorizontalLines />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderLeftColor: '#fff',
                        borderRightColor: '#fff',
                        borderLeftWidth: 3,
                        borderRightWidth: 3,
                        paddingHorizontal: 4,
                    }}
                >
                    {matrixColumns}
                </View>
            <HorizontalLines />
        </View>
    );
}
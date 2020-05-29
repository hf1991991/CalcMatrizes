import React from 'react';
import { View } from 'react-native';

const HorizontalLines = () => (
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}
    >
        <View 
            style={{
                width: 30,
                height: 3,
                backgroundColor: '#fff',
            }}
        />
        <View 
            style={{
                width: 30,
                height: 3,
                backgroundColor: '#fff',
            }}
        />
    </View>
);

export default function MatrixColumns({ matrixColumns }) {
    return (
        <>
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
        </>
    );
}
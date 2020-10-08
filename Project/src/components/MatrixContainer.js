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

export default function MatrixColumns({ matrixContent, maxWidth }) {
    return (
        <View
            style={{
                justifyContent: 'center',
                maxWidth: maxWidth,
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
                    {matrixContent}
                </View>
            <HorizontalLines />
        </View>
    );
}
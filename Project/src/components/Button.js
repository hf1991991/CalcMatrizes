import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function Button({ source, style, resizeMode='contain', onPress }) {
    return (
        <TouchableOpacity
            style={{
                flex: 1,
                ...style,
            }}
            onPress={onPress}
        >
        <Image 
            style={{
                flex: 1,
                height: undefined,
                width: undefined,
            }}
            source={source} 
            resizeMode={resizeMode}
        />
        </TouchableOpacity>
    );
}
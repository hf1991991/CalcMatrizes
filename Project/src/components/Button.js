import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function Button({ source, style, resizeMode='contain', onPress, disabled=false }) {
    return (
        <TouchableOpacity
            style={{
                flex: 1,
                opacity: disabled && 0.5,
                ...style,
            }}
            disabled={disabled}
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
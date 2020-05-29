import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function ArrowButton({ 
    vertical=false,
    source,
    onPress,
    disabled=false,
}) {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            disabled={disabled} 
            style={{
                opacity: disabled && 0.5,
            }} 
        >
            <Image
                style={
                    vertical
                        ? {
                            height: 11*1.3,
                            width: 22*1.3,
                            marginHorizontal: 10,
                        }
                        : {
                            width: 11*1.3,
                            height: 22*1.3,
                            marginVertical: 10,
                        }
                }
                source={source}
            />
        </TouchableOpacity>
    );
}
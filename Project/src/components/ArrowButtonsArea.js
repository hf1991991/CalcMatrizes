import React from 'react';
import { View, Text } from 'react-native';
import ArrowButton from './ArrowButton';

export default function ArrowButtonsArea({ 
    vertical,
    hidden,
    disabled=false,
    editableDimensions,
    changeEditableDimensions,
    determinant=null,
    crossWidth,
}) {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                ...(vertical
                    ? {
                        width: crossWidth,
                    }
                    : { 
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        height: crossWidth,
                    }
                ),
            }}
        >
            {
                !vertical && (
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 25,
                            position: 'absolute',
                            left: 0,
                        }}
                    >
                        {editableDimensions.rows}x{editableDimensions.columns}
                    </Text>
                )
            }
            <View
                style={{
                    ...(!vertical && {flexDirection: 'row'}),
                    opacity: hidden ? 0.0 : 1.0,
                }}
            >
                <ArrowButton 
                    vertical={vertical}
                    source={vertical
                        ? require('../../assets/icons/LeftArrow.png')
                        : require('../../assets/icons/UpArrow.png')
                    }
                    onPress={vertical
                        ? () => changeEditableDimensions({
                            ...editableDimensions,
                            columns: editableDimensions?.columns - 1,
                        })
                        : () => changeEditableDimensions({
                            ...editableDimensions,
                            rows: editableDimensions?.rows - 1,
                        })
                    }
                    disabled={
                        (vertical 
                            ? editableDimensions?.columns 
                            : editableDimensions?.rows
                        ) <= 1 
                        || hidden 
                        || disabled
                    }
                />
                <ArrowButton 
                    vertical={vertical}
                    source={vertical
                        ? require('../../assets/icons/RightArrow.png')
                        : require('../../assets/icons/DownArrow.png')
                    }
                    onPress={vertical
                        ? () => changeEditableDimensions({
                            ...editableDimensions,
                            columns: editableDimensions?.columns + 1,
                        })
                        : () => changeEditableDimensions({
                            ...editableDimensions,
                            rows: editableDimensions?.rows + 1,
                        })
                    }
                    disabled={hidden || disabled}
                />
            </View>
            {
                !vertical && determinant !== null && (
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 25,
                            position: 'absolute',
                            right: 0,
                        }}
                    >
                        det: {determinant}
                    </Text>
                )
            }
        </View>
    );
}
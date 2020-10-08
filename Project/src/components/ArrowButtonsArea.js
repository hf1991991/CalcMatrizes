import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ArrowButton from './ArrowButton';

export default function ArrowButtonsArea({ 
    vertical,
    hidden,
    disabled=false,
    editableDimensions,
    changeEditableDimensions,
    crossWidth,
    bottomLeftText,
    bottomRightText,
    bottomMiddleText,
    onPressBottomLeftText,
    onPressBottomMiddleText,
    onPressBottomRightText,
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
                    <TouchableOpacity
                        onPress={onPressBottomLeftText}
                        style={{
                            position: 'absolute',
                            left: 0,
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 25,
                            }}
                        >
                            {bottomLeftText}
                        </Text>
                    </TouchableOpacity>
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
                !vertical && bottomRightText !== null && (
                    <TouchableOpacity
                        onPress={onPressBottomRightText}
                        style={{
                            position: 'absolute',
                            right: 0,
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 25,
                            }}
                        >
                            {bottomRightText}
                        </Text>
                    </TouchableOpacity>
                )
            }
            {
                !vertical && bottomMiddleText !== null && (
                    <TouchableOpacity
                        onPress={onPressBottomMiddleText}
                        style={{
                            position: 'absolute',
                            flex: 1,
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 25,
                            }}
                        >
                            {bottomMiddleText}
                        </Text>
                    </TouchableOpacity>
                )
            }
        </View>
    );
}
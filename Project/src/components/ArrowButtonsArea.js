import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useCalculator } from '../hooks/useCalculator';
import { useOrientation } from '../hooks/useOrientation';
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
    forwardHistory,
    backHistory
}) {

    const {
        matrixHistory,
        undoHistory,
        redoHistory
    } = useCalculator();

    const { isPortrait } = useOrientation();

    const historyDisabled = useMemo(
        () => forwardHistory 
            ? matrixHistory.currentPosition === matrixHistory.history.length - 1
            : matrixHistory.currentPosition === 0,
        [forwardHistory, matrixHistory]
    );

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
            {
                (forwardHistory || backHistory) && isPortrait && (
                    <TouchableOpacity
                        onPress={forwardHistory ? redoHistory : undoHistory}
                        style={{
                            position: 'absolute',
                            top: 0,
                            opacity: historyDisabled && 0.5,
                        }}
                        disabled={historyDisabled}
                    >
                        <Image
                            style={{
                                width: 18.5*1.3,
                                height: 18.5*1.3,
                            }}
                            disabled
                            source={
                                forwardHistory
                                    ? require('../../assets/icons/forwardHistory.png')
                                    : require('../../assets/icons/backHistory.png')
                            }
                        />
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
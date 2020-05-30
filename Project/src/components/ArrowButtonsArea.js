import React from 'react';
import { View } from 'react-native';
import ArrowButton from './ArrowButton';

export default function ArrowButtonsArea({ 
    vertical,
    hidden,
    disabled=false,
    editableDimensions,
    changeEditableDimensions,
}) {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                opacity: hidden ? 0.0 : 1.0,
                ...(vertical
                    ? {
                        width: 70,
                    }
                    : { 
                        flexDirection: 'row',
                        height: 70,
                    }
                ),
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
    );
}
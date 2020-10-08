import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const OrientationContext = createContext({});

export const OrientionProvider = ({ children }) => {

    const checkIfPortrait = useCallback(() => {
        const dimensions = Dimensions.get('screen');
        return dimensions.height >= dimensions.width;
    }, []);
    
    const [isPortrait, setIsPortrait] = useState(checkIfPortrait());

    useEffect(
        () => Dimensions.addEventListener(
            'change', () => setIsPortrait(checkIfPortrait())
        ), 
        [checkIfPortrait]
    )

    return (
        <OrientationContext.Provider value={{ isPortrait }}>
            {children}
        </OrientationContext.Provider>
    )
}

export const useOrientation = () => useContext(OrientationContext);
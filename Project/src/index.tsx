import React from 'react';
import CalculatorScreen from './CalculatorScreen';

import { OrientionProvider } from './hooks/useOrientation';
import { CalculatorProvider } from './hooks/useCalculator';

const App = () => {
    return (
        <OrientionProvider>
            <CalculatorProvider>
                <CalculatorScreen/>
            </CalculatorProvider>
        </OrientionProvider>
    );
}

export default App;
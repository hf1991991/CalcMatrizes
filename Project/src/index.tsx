import React from 'react';
import CalculatorScreen from './CalculatorScreen';

import { OrientionProvider } from './hooks/useOrientation';
import { CalculatorProvider } from './hooks/useCalculator';

const App: React.FC = () => {
    return (
        <OrientionProvider>
            <CalculatorProvider>
                <CalculatorScreen/>
            </CalculatorProvider>
        </OrientionProvider>
    );
}

export default App;
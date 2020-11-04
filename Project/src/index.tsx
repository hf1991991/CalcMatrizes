import React from 'react';
import CalculatorScreen from './CalculatorScreen';

import { OrientionProvider } from './hooks/useOrientation';
import { CalculatorProvider } from './hooks/useCalculator';

// Impedir que os console.logs rodem na produção   
if (!__DEV__) console.log = () => {};

const App: React.FC = () => {
    return (
        <OrientionProvider>
            <CalculatorProvider>
                <CalculatorScreen />
            </CalculatorProvider>
        </OrientionProvider>
    );
}

export default App;
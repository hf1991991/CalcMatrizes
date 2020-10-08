import React from 'react';
import { Dimensions } from 'react-native';
import CalculatorScreen from './CalculatorScreen';

export default class App extends React.Component {
    constructor() {
        super();

        const isPortrait = () => {
            const dimensions = Dimensions.get('screen');
            return dimensions.height >= dimensions.width;
        };

        this.state = {
            isPortrait: isPortrait(),
        };

        Dimensions.addEventListener('change', () => {
            this.setState({
                isPortrait: isPortrait()
            });
        });

    }

    render() {
        return (
            <CalculatorScreen 
                isPortrait={this.state.isPortrait}
            />
        );
    }
}
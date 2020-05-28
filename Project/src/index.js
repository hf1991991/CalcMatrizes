import React from 'react';
import { SafeAreaView, StatusBar, Image } from 'react-native';
import ButtonsArea from './components/ButtonsArea';

export default function App() {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#000',
                justifyContent: 'flex-end',
            }}
        >
            <StatusBar barStyle='light-content' />
            <ButtonsArea />
        </SafeAreaView>
    );
}
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Button from './Button';

const windowWidth = Dimensions.get('window').width;

export default function ButtonsArea() {
    return (
        <>
            <View 
                style={styles.button}
            >
                <Button
                    source={require('../../assets/buttons/AC.png')}
                />
                <Button
                    source={require('../../assets/buttons/Save.png')}
                />
                <Button
                    source={require('../../assets/buttons/InactiveSecond.png')}
                />
                <Button
                    source={require('../../assets/buttons/R.png')}
                />
            </View>
            <View 
                style={styles.button}
            >
                <Button
                    source={require('../../assets/buttons/7.png')}
                />
                <Button
                    source={require('../../assets/buttons/8.png')}
                />
                <Button
                    source={require('../../assets/buttons/9.png')}
                />
                <Button
                    source={require('../../assets/buttons/AxB.png')}
                />
            </View>
            <View 
                style={styles.button}
            >
                <Button
                    source={require('../../assets/buttons/4.png')}
                />
                <Button
                    source={require('../../assets/buttons/5.png')}
                />
                <Button
                    source={require('../../assets/buttons/6.png')}
                />
                <Button
                    source={require('../../assets/buttons/Subtract.png')}
                />
            </View>
            <View 
                style={styles.button}
            >
                <Button
                    source={require('../../assets/buttons/1.png')}
                />
                <Button
                    source={require('../../assets/buttons/2.png')}
                />
                <Button
                    source={require('../../assets/buttons/3.png')}
                />
                <Button
                    source={require('../../assets/buttons/Add.png')}
                />
            </View>
            <View 
                style={styles.button}
            >
                <Button
                    style={{
                        flex: 2,
                    }}
                    source={require('../../assets/buttons/0.png')}
                />
                <Button
                    source={require('../../assets/buttons/Comma.png')}
                />
                <Button
                    source={require('../../assets/buttons/Inverse.png')}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        height: (windowWidth/4)*0.75,
        flexDirection: 'row',
        marginVertical: 6,
        marginHorizontal: 6,
    },
});
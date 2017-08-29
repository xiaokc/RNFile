/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';
import MainView from './js/MainView';

export default class RNFile extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{component:MainView}}
                renderScene={(route, navigator) => {
                return <route.component navigator={navigator} {...route.args}/>
                }
            }
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('RNFile', () => RNFile);

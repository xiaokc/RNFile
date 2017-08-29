/**
 * Created by xiaokecong on 29/08/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Button from 'react-native-button';

import ImagePage from './ImagePage';
import {Navigator} from 'react-native-deprecated-custom-components';

export default class MainView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.topText}>react-native file</Text>

                <Button onPress={()=> this.jumpToImagePage()} style={styles.btn}>Image</Button>
                <Button onPress={()=> this.jumpToImagePage()} style={styles.btn}>Music</Button>
                <Button onPress={()=> this.jumpToImagePage()} style={styles.btn}>Video</Button>
            </View>
        )
    }

    jumpToImagePage() {
        this.props.navigator.push({
            id: 'ImagePage',
            component: ImagePage,
            sceneConfig: Navigator.SceneConfigs.PushFromRight,
        })
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    topText:{
        backgroundColor: '#e9eaed',
        height: 50,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign:'center', // 文字在Text组件中垂直居中
    },
    btn: {
        margin: 10,
        backgroundColor: "#3B5998",
        color: "white",
        padding: 10
    },
});
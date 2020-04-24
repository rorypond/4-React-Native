import React, { Component } from 'react';
import Directory from './DirectoryComponent';
import { createStackNavigator } from 'react-navigation';
import CampsiteInfo from './CampsiteInfo';
import { View, Platform } from 'react-native';

const DirectoryNavigator = createStackNavigator(
    {
        Directory: { screen: Directory },
        CampsiteInfo: { screen: CampsiteInfo }
    }, 
    {
        initialRouteName: 'Directory',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }
    }
);

class Main extends Component {


    render() {
        return ( 
            <View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
            <DirectoryNavigator />
        </View>
            );
    }
}

export default Main;
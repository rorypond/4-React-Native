import React, { Component } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import Swipeout from 'react-native-swipeout';
import { deleteFavorite } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        favorites: state.favorites
    };
};
//anytime that we want to be able to dispatch an actioncreator from a component 
const mapDispatchToProps = {
    deleteFavorite: campsiteId => (deleteFavorite(campsiteId))
}

class Favorites extends Component {

    static navigationOptions ={
        title: 'My Favorites'
    }


    render(){

        const { navigate } = this.props.navigation;
        const renderFavoriteItem = ({item}) => {
            const rightButton = [
                {
                    text: 'Delete',
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Delete Favorite',
                            'Are you sure yo uwish to delete the favorite campsite ' + item.name + '?',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log( item.name + ' Not Deleted'),
                                    style: 'cancel'
                                },
                                {
                                    text: 'Ok',
                                    onPress: () => this.props.deleteFavorite(item.id)
                                }
                            ],
                            {
                                cancelable: false // alerts on andriod can canel when clicked outside the box
                            }

                        )
                    } 
                    
                    
                }
            ];

            return (
                <Swipeout right={rightButton} autoClose={true}>
                    <ListItem
                        title={item.name}
                        subtitle={item.description}
                        leftAvatar={{source: {uri: baseUrl + item.image}}}
                        onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})}
                    />
                </Swipeout>

            );
        }


        if (this.props.campsites.isLoading){
            return <Loading />;
        }
        if (this.props.campsites.errMess){
            return(
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            );
        }
        return(
            <FlatList
             data={this.props.campsites.campsites.filter(
                campsite => this.props.favorites.includes(campsite.id)
             )}
             renderItem={renderFavoriteItem}
             keyExtractor={item => item.id.toString()}
            />
        );
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
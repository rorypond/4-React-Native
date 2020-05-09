import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {      // connecting the Redux Store's state to our props. Only connecting the state portion we need                                               which is campsites and comments
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text))
};

function RenderCampsite (props) {
    
    const { campsite } = props;

    const view = React.createRef();

    const recognizeDrag = ({ dx }) => (dx < 200) ? true : false;

    const recognizeComment = ({ dx }) => (dx > 200) ? true : false; //if the gesture is more than 200px, the comment modal pops up


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            view.current.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'canceled'));
        },
        onPanResponderEnd: ( e, gestureState ) => {
            console.log('pan resonder end', gestureState);
            
            if (recognizeDrag(gestureState)){
                Alert.alert(
                    'Add Favorite',
                    'Are You Sure you wish to add' + campsite.name + ' to favorite ?',
                    [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => console.log("Cancel Pressed")
                    },
                    {
                        text: 'OK',
                        onPress: () => props.favorite ? console.log("Already set as a favorite") : props.markFavorite()
                    }
                    ],
                    { cancelable: false }
                );
            }else if(recognizeComment(gestureState)){ //
                props.onShowModal();
            }
            return true;
        }
    });
    
    if (campsite){
        return (
            <Animatable.View 
                animation='fadeInDown' 
                duration={2000} 
                delay={1000}
                ref={view}
                {...panResponder.panHandlers} 
            >
            <Card
                featuredTitle={campsite.name}
                image={{uri: baseUrl + campsite.image}}
                
                >
                
                <Text style={{margin: 10}}>
                {campsite.description}
                </Text>
                <View style={styles.cardRow}>
                <Icon 
                    name={props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    raised
                    reverse
                    onPress={() => props.favorite ? 
                        console.log('Already set as a favorite') : props.markFavorite()}
                    
                />
                <Icon
                    name={'pencil'}
                    type='font-awesome'
                    color='#5637DD'
                    raised
                    reverse
                    onPress={() => props.onShowModal()}
                    style={styles.cardItem}
                /> 
                
                </View>

            </Card>
            </Animatable.View>
        );
    }
    return <View />;
}


function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating 
                readonly
                startingValue={item.rating}
                imageSize={10}
                style={{alignItems: 'flex-start', paddingVertical: '5%'}}
                />
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    }
    
    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
        </Animatable.View>
    );
};

class CampsiteInfo extends Component{
    constructor(props){
        super(props);

        this.state ={
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        };
    }

    toggleModal(){
        this.setState({
            showModal: !this.state.showModal
        })
    }

    handleComment(campsiteId){
        console.log(JSON.stringify(this.state.rating, this.state.author, this.state.text));
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
        this.toggleModal();
    }

    resetForm(){
        this.setState({
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        })
    }

    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        Title: 'Campsite Information'
    }
    render(){
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite
                    campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)} 
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={ () => this.toggleModal() }
                    />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={ ()=> this.toggleModal()}
                   
                >
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={(rating) => this.setState({rating: rating})}
                            style={{paddingVertical: 10}}
                        />
                        <Input 
                                placeholder='Author'
                                leftIcon={
                                    <Icon
                                    name='user-o'
                                    type='font-awesome'
                                    size={24}
                                    color='black'
                                    value={this.state.author}
                                    />
                                }
                                leftIconContainerStyle={{paddingRight: 10}}
                                onChangeText={ (author) => this.setState({author: author}) }
/>
                        <Input 
                            placeholder="Comments"
                            leftIcon={
                                <Icon 
                                    name='comment-o'
                                    type='font-awesome'
                                    size={24}
                                    color='black'
                                    value={this.state.text}
                                />
                            }
                            leftIconContainerStyle={{paddingRight: 10}}
                            onChangeText={ (text) => this.setState({ text: text})}
                        />

                    <View style={{margin: 10}}>
                        <Button
                         title="Submit"   
                         color='#5637DD'
                         onPress={ () => {
                            this.handleComment(campsiteId);
                            this.resetForm();
                        }}
                        >

                        </Button>
                    </View>
                    <View style={{margin: 10}}>
                        
                        <Button
                            onPress={() => {
                                this.toggleModal()
                            }}
                            color='#808080'
                            title='Cancel'    
                        >
                        </Button>
                    </View>

                    </View>


                </Modal>
            </ScrollView>

        );
    }

}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 0
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }

})
export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
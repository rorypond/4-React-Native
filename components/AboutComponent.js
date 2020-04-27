import React , { Component } from 'react';
import { PARTNERS } from '../shared/partners';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Card, ListItem } from 'react-native-elements';

class About extends Component {
    constructor(props){
        super(props);
        this.state = {
            partners: PARTNERS
        }

    }

    static navigationOptions = {
        title: 'About'
    }
    
    render(){
        const  RenderPartners =  ({ item }) => {
            if (item){
                return(
                    <ListItem 
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{ source: require('./images/bootstrap-logo.png')}}
                    />
                );
            }
        }

        return(
          <ScrollView>
            <Card
                title='Our Mission'
                wrapperStyle={{ margin: 20 }}
            >
                <Text>
                We present a curated database of the best campsites in the vast woods and backcountry of the World Wide Web Wilderness. We increase access to adventure for the public while promoting safe and respectful use of resources. The expert wilderness trekkers on our staff personally verify each campsite to make sure that they are up to our standards. We also present a platform for campers to share reviews on campsites they have visited with each other.
                </Text>
            </Card>
            <Card
                title='Community Partners'
                wrapperStyle={{ margin: 20 }}
            >
                <FlatList 
                data={this.state.partners}
                renderItem={RenderPartners}
                keyExtractor={item => item.id.toString()}
                />
            </Card>
          </ScrollView>  
        )
    }

}

export default About;
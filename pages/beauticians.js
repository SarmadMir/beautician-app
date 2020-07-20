import React from 'react';
import { StyleSheet, Dimensions, ScrollView, ImageBackground, View, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import ImageOverlay from "react-native-image-overlay";
import { Button, Block, Text, Input, theme } from 'galio-framework';
import bgImage from "../images/background.jpg";
import firebase from "firebase";
import { HeaderHeight } from "../constants/utils";

const { width, height } = Dimensions.get('screen');

export default class beauticians extends React.Component {

    constructor() {
        super();
        this.state = {
            beauticians: [],
            name: '',
            category: '',
            gender: '',
            about: '',
            profile_pic: '',
            services: [],
            loading: true,
            mobile_no: '',
            uid:''
        }
    }

    // Load the beauticians data
    componentDidMount() {
        var itemList = [];
        firebase.database().ref('beauticians').once('value', snapshot => {
            snapshot.forEach(function (child) {
                // console.log(child.val().approved)
                if(child.val().approved == 1)
                {
                itemList.push(child.val());
                }   
            })
            this.setState({ beauticians: itemList })
            this.setState({ loading: false })
        })
    }

    render() {
        // console.log(this.state.beauticians)
        const { loading } = this.state;
        return loading ? (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="rgba(84, 79, 79, 0.98)" />
            </View>
        ) : (
                <ImageBackground source={bgImage} style={styles.backgroundContainer} blurRadius={8}>
                    <ImageOverlay
                        height={height}
                        overlayColor="black"
                        overlayAlpha={0.8}>
                        <Block flex style={styles.profile}>
                        <FlatList
                            data={this.state.beauticians}
                            renderItem={({ item }) => (
                                <ListItem
                                    roundAvatar
                                    title={this.renderName(item.username)}
                                    subtitle={this.renderSubtitle(item.category, item.gender, item.role)}
                                    leftAvatar={{ size: 100, source: { uri: item.profile_picture } }}
                                    containerStyle={styles.list}
                                    onPress={() => this.onListItemClick(
                                                            item.uid,
                                                            item.username,
                                                            item.profile_picture,
                                                            item.address,
                                                            item.about,
                                                            item.services,
                                                            item.mobile_no,
                                                            item.gender,
                                                            item.category,
                                                            item.email
                                        )}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                        </Block>
                    </ImageOverlay>
                </ImageBackground>
            );
    }
    onListItemClick = (uid,username, profile_picture, address, about, services, mobile_no,gender,category,email) => {
        this.props.navigation.navigate('beauticianInfo', {
            uid:uid,
            username: username,
            profile_pic: profile_picture,
            address: address,
            about: about,
            services: services,
            mobile_no: mobile_no,
            gender:gender,
            category:category,
            email:email
        })
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 5,
                    width: '0%',
                    backgroundColor: "rgba(84, 79, 79, 0.98)",
                }}
            />
        )
    }
    renderName = (username) => {
        return (
            <Text style={styles.listName}>
                {username}
            </Text>
        )
    }
    renderSubtitle = (category,gender,role) => {
        return (
            <View>
            <View style={styles.category}>
            <Text style = {styles.listSub1}>
                {category}
            </Text>
            <Text style = {styles.listSub2}>
                {role}
            </Text>
            </View>
            <Text style = {styles.listSub3}>
                {gender}
            </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    profile: {
        marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
        marginBottom: -HeaderHeight * 2,
    },
    list: {
        width:width,
        borderBottomWidth: 0,
        borderTopWidth: 1 ,
        borderRadius:15,
        backgroundColor:"rgba(88, 74, 74, 0.9)"
    },
    backgroundContainer: {
        width: width,
        height: height
    },
    listName: {
        fontSize: 20,
        fontWeight: "600",
        color:"rgb(251, 248, 248)"
    },
    category:{
        flexDirection:'row',
    },
    listSub1: {
        fontSize: 15,
        fontWeight: "600",
        color:"rgb(19, 235, 206)"
    },
    listSub2: {
        fontSize: 15,
        fontWeight: "600",
        color:"#B5B9BC",
        paddingLeft:5
    },
    listSub3: {
        fontSize: 14,
        fontWeight: "400",
        color:"rgb(225, 238, 236)",
        paddingTop:2,
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});

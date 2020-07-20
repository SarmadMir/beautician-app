import React from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import ImageOverlay from "react-native-image-overlay";
import { Text, Block, theme } from 'galio-framework';
import { HeaderHeight } from "../constants/utils";
import firebase, { app } from "firebase";
import { Icon } from '../components';

const { width, height } = Dimensions.get('screen');

export default class Appointments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            name: '',
            pic: '',
            category: '',
            address: '',
            loading: true,
        }
    }

    // Load the appointments for customer
    componentDidMount() {
        var itemList = [];
        firebase.database().ref('beauticians').once('value', snapshot => {
            snapshot.forEach(function (childd) {
                childd.child('appointments').forEach(function (child) {
                    if (child.key == firebase.auth().currentUser.uid) {
                        // console.log("childddddd...."+child.key)
                        itemList.push(childd.val())               // fetch those beauticians who are booked by current customer
                    }
                })
            })
            this.setState({ appointments: itemList })
            this.setState({ loading: false })
        })
    }
    render() {
        const { loading } = this.state;
        return loading ? (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="rgba(84, 79, 79, 0.98)" />
            </View>
        ) : (
                <ImageOverlay
                    height={height}
                    overlayColor="black"
                    overlayAlpha={0.8}>
                    <Block flex style={styles.profile}>
                        <FlatList
                            data={this.state.appointments}
                            renderItem={({ item }) => (
                                <ListItem
                                    roundAvatar
                                    activeOpacity={0.7}
                                    title={this.renderName(item.username)}
                                    subtitle={this.renderSubtitle(item.category, item.address, item.role, item.appointments)}
                                    leftAvatar={{ size: 100, source: { uri: item.profile_picture } }}
                                    containerStyle={styles.list}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                    </Block>
                </ImageOverlay>
            );
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

    // so what we are doing is that only those appointment timings will be shown whose id matches with list appointment's id 
    renderSubtitle = (category, address, role, appointments) => {
        return (
            <View>
                <View style={styles.row}>
                    <View style={styles.column1}>
                        <Text style={styles.listSub2}>
                            {role}
                        </Text>
                        <Text style={styles.listSub1}>
                            {category}
                        </Text>
                    </View>
                    <View style={styles.column2}>
                        <View>
                            {this.renderStatus(appointments)}
                        </View>
                        <View style={styles.row}>
                            <View>
                                {this.renderTime(appointments)}
                            </View>
                            <View>
                                {this.renderDate(appointments)}
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                        <Text style={styles.listSub3}>
                            <Icon name="map-marker" family="font-awesome" color={theme.COLORS.WHITE} size={18} />{` `}{address}
                        </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderStatus = (appointments) => {
        return Object.values(appointments).map(item => {
            return Object.values(item).map(item => {
                return (
                    <Text key={item} style={styles.listServices}>
                        {item.status}
                    </Text>
                )
            })
        })
    }

    renderTime = (appointments) => {
        return Object.values(appointments).map(item => {
            return Object.values(item).map(item => {
                return (
                    <Text key={item} style={styles.listServices}>
                        {item.time}{` `}|{` `}
                    </Text>
                )
            })
        })
    }

    renderDate = (appointments) => {
        return Object.values(appointments).map(item => {
            return Object.values(item).map(item => {
                return (
                    <Text key={item} style={styles.listServices}>
                        {item.date}
                    </Text>
                )
            })
        })

    }
}

const styles = StyleSheet.create({
    profile: {
        marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
        marginBottom: -HeaderHeight * 2,
    },
    listServices: {
        fontSize: 14,
        fontWeight: "400",
        color: "rgb(251, 248, 248)",
        paddingBottom: 5
    },
    list: {
        width: width,
        borderBottomWidth: 0,
        borderTopWidth: 1,
        borderRadius: 15,
        backgroundColor: "rgba(88, 74, 74, 0.9)",

    },
    backgroundContainer: {
        width: width,
        height: height
    },
    listName: {
        fontSize: 20,
        fontWeight: "600",
        color: "rgb(251, 248, 248)",
        paddingBottom: 2,
        paddingTop: 5
    },
    row: {
        flexDirection: 'row',
    },
    column1: {
        flexDirection: 'column',
    },
    column2: {
        flexDirection: 'column',
        paddingLeft: '25%',
        marginTop: -20,
        
    },
    listSub1: {
        fontSize: 15,
        fontWeight: "600",
        color: "rgb(19, 235, 206)",
    },
    listSub2: {
        fontSize: 15,
        fontWeight: "600",
        color: "#B5B9BC",
        paddingBottom: 4,
    },
    listSub3: {
        fontSize: 14,
        fontWeight: "400",
        color: "rgb(225, 238, 236)",
        paddingTop: 2,
        textAlign: 'left',
        flex: 1, flexWrap: 'wrap'
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

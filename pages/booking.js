import React from 'react';
import { StyleSheet, Dimensions, ScrollView, StatusBar, View, TouchableOpacity, Image } from 'react-native';
import ImageOverlay from "react-native-image-overlay";
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { Calendar } from 'react-native-calendars';
import Animbutton from '../components/animButton'
import { Icon } from '../components';
import * as firebase from 'firebase'
import { HeaderHeight } from "../constants/utils";

const { width, height } = Dimensions.get('screen');

const jsonData = {
    "slots": {
        "9:00am": "9:00am ",
        "11:00am": "11:00am",
        "1:00pm": "1:00pm",
        "3:00pm": "3:00pm",
        "5:00pm": "5:00pm",
        "7:00pm": "7:00pm"
    }
}

export default class booking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            pic: 'none',
            address: '',
            category: '',
            uid:'',
            selected: '',
            time:'',
            date:'',
            status:''
        }
        this.onDayPress = this.onDayPress.bind(this);
    }

    // When date is selected from the calender
    onDayPress(day) {
        this.setState({
            selected: day.dateString // bookingDate
        });
    }

    // when slot is selected from the timings
    _bookSlot(status, key, value) {
        const date = this.state.selected
        if (status)
        this.setState({time:key,date:date,status:'Pending'})
        else
        this.setState({time:null,date:null,status:'Pending'})
    }

    //load the beautician's name and data.
    componentDidMount() {
        const { navigation } = this.props;
        this.setState({ name: navigation.getParam('name') });
        this.state.pic = navigation.getParam('pic');
        this.state.address = navigation.getParam('address');
        this.state.category = navigation.getParam('category');
        this.state.uid = navigation.getParam('uid');
    }

    render() {
        return (
            <ImageOverlay
                height={height}
                overlayColor="black"
                overlayAlpha={0.8}>
                <Block flex style={styles.profile}>
                <View>
                    {this.renderHeader()}
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.scroll}>
                        <Calendar
                            onDayPress={this.onDayPress}
                            style={styles.calendar}
                            theme={{
                                calendarBackground: 'rgba(169, 177, 176, 0.5)',
                                textSectionTitleColor: '#b6c1cd',
                                backgroundColor: 'rgba(169, 177, 176, 0.5)',
                                dayTextColor: 'black',
                                arrowColor: 'white',
                                monthTextColor: 'white',
                                selectedDayBackgroundColor: 'rgb(40, 168, 151)',
                                todayTextColor: 'rgb(125, 376, 223)'
                            }}
                            hideExtraDays
                            markedDates={{ [this.state.selected]: { selected: true } }}
                        />
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={styles.timings}>Timings</Text>
                            {this.renderSlots()}
                        </View>
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.save}
                                onPress={() => this.Confirm()}
                            >
                                <Text style={styles.text}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                </Block>
            </ImageOverlay>
        );
    }

    renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <Image
                    style={styles.userImage}
                    source={{
                        uri: this.state.pic,
                    }}
                />
                <View style={styles.details}>
                    <View style={styles.userNameRow}>
                        <Text style={styles.userNameText}>{this.state.name}</Text>
                    </View>
                    <View style={styles.userNameRow}>
                        <Text style={styles.listSub1}>{this.state.category} Services</Text>
                    </View>
                    <View style={styles.userNameRow}>
                        <Text style={styles.listSub2}><Icon name="map-marker" family="font-awesome" color={theme.COLORS.WHITE} size={18} />{` `}{this.state.address}</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderSlots = () => {
        let _this = this
        const slots = jsonData.slots
        const slotsarr = Object.keys(slots).map(function (k) {
            return (<View key={k} style={{ margin: 5 }}>
                <Animbutton countCheck={0} onColor={"rgb(40, 168, 151)"} effect={"rotate"} _onPress={(status) => _this._bookSlot(status, k, slots[k])} text={slots[k]} />
            </View>)
        });
        return (
            <View style={styles.container}>
                <ScrollView style={styles.slots} horizontal={true} >
                    {slotsarr}
                </ScrollView>
            </View>
        );
    }

    // confirm the booking
    Confirm = () => {
        const uid = firebase.auth().currentUser.uid
        firebase.database().ref('/customers/'+uid).on('value', snapshot => 
        {
        var approved = snapshot.val().approved
        if (approved == '1') 
        {
        const bid = this.state.uid
        firebase.database().ref('/customers/'+uid+'/appointments/'+bid+'/BookingDetails/').update({
            date:this.state.date,
            time:this.state.time,
            status:this.state.status
        })
        firebase.database().ref('/beauticians/'+bid+'/appointments/'+uid+'/BookingDetails/').update({
            date:this.state.date,
            time:this.state.time,
            status:this.state.status
        },
            function (error) {
                if (error) {
                    alert("There was a problem booking your appointment.")
                } else {
                    alert("Appointment booked successfully!!")
                }
            });
        }
        else
        {
            alert("Your profile is not approved to book the beautician right now. Check back later!")
        }
        })
        this.props.navigation.navigate('Appointments')
    }
}

const styles = StyleSheet.create({
    profile: {
        marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
        marginBottom: -HeaderHeight * 2,
    },
    slots:{
        flexDirection:'row',
    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    scroll: {
        width: width,
    },
    timings: {
        color: 'rgb(125, 226, 213)',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 8,
        paddingTop: 15
    },
    userImage: {
        borderRadius: 10,
        height: 100,
        marginBottom: 10,
        width: 100,
        zIndex: 2
    },
    userNameRow: {
        marginBottom: 5,
        paddingLeft: 15
    },
    userNameText: {
        color: 'rgb(251, 248, 248)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    listSub1: {
        fontSize: 16,
        fontWeight: "500",
        color: "rgb(230, 237, 248)"
    },
    listSub2: {
        fontSize: 15,
        fontWeight: "500",
        color: theme.COLORS.NEUTRAL
    },
    calendar: {
        paddingTop: 5,
        height: 320,
        width: width,
        borderRadius: 10
    },
    backgroundContainer: {
        width: width,
        height: height
    },
    email: {
        color: 'rgb(251, 248, 248)',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 10
    },
    details: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 5,
        backgroundColor: 'rgba(169, 177, 190, 0.5)',
        borderRadius: 15,
        width: width - 100,
        marginLeft: -10
    },
    headerContainer: {
        width: width,
        flexDirection: 'row',
        paddingLeft: 10,
        marginBottom: 10,
        marginTop: 45,
    },
    footer: {
        paddingHorizontal: 28,
        justifyContent: 'flex-end',
        zIndex: 5,
        width: width
    },
    text: {
        color: 'rgb(231, 240, 240)',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '700'
    },
    save: {
        height: 45,
        borderRadius: 15,
        backgroundColor: 'rgb(40, 168, 151)',
        justifyContent: 'center',
        marginTop: 20
    },
});

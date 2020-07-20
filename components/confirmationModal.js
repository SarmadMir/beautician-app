import React, { Component } from 'react';
import Modal, {ScaleAnimation,} from 'react-native-modals';
import { StyleSheet, Dimensions, View, Text, Image } from 'react-native';
import { Icon } from '../components';
import { Button, theme, Block } from 'galio-framework';
import firebase from 'firebase';

const { width, height } = Dimensions.get('screen');

export default class ModalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            cid: null,
            name: null,
            gender: null,
            email: null,
            address: null,
            appointment: [],
            pic: 'nuuu',
            mobile_no: null,
        };
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            modalVisible: nextProps.modalVisible,
            cid: nextProps.id,
            name: nextProps.name,
            gender: nextProps.gender,
            email: nextProps.email,
            address: nextProps.address,
            appointment: nextProps.appointment,
            pic: nextProps.pic,
            mobile_no: nextProps.mobile_no
        });
    }

    render() {
        return (
            <Modal
              onTouchOutside={() => {
                this.setState({ modalVisible: false });
              }}
              visible={this.state.modalVisible}
              onSwipeOut={() => this.setState({ modalVisible: false })}
              modalAnimation={new ScaleAnimation()}
              onHardwareBackPress={() => {
                this.setState({ modalVisible: false });
                return true;
              }}
            >
                <View style={styles.modalView}>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <View style={{ padding: 15 }}>
                            <Image style={styles.userImage} source={{ uri: this.state.pic }} />
                        </View>
                        <View style={{ flexDirection: 'column', paddingTop: 15 }}>
                            <View style={styles.userNameRow}>
                                <Icon name="envelope-o" family="font-awesome" color={theme.COLORS.NEUTRAL} size={18} style={{ textAlign: 'center', paddingBottom: 5 }} />
                                <Text style={styles.email}>{this.state.email}</Text>
                            </View>
                            <View style={styles.userNameRow}>
                                <Icon name="phone" family="font-awesome" color={theme.COLORS.NEUTRAL} size={18} style={{ textAlign: 'center', paddingBottom: 5, paddingTop: 10 }} />
                                <Text style={styles.email}>{this.state.mobile_no}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.name}>{this.state.name}</Text>
                        <Text style={styles.list1}>{this.state.gender}</Text>
                        <Text style={styles.list1}>
                            <Icon name="map-marker" family="font-awesome" color={theme.COLORS.NEUTRAL} size={18} />{` `}
                            {this.state.address}
                        </Text>
                        <View>{this.renderAppointments()}</View>
                    </View>
                    <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                        <Block row space="evenly">
                            <Block flex={1.25} right space="evenly">
                                <Button shadowless color="success" onPress={()=>this.accept()} style={[styles.button, styles.shadow]}>
                                    ACCEPT
                                </Button>
                            </Block>
                            <Block center>
                                <Button shadowless onPress={()=>this.complete()} style={[styles.button, styles.shadow]}>
                                COMPLETE
                                </Button>
                            </Block>
                            <Block flex left>
                                <Button shadowless onPress={()=>this.cancel()} color="error" style={[styles.button, styles.shadow]}>
                                    CANCEL
                                </Button>
                            </Block>
                        </Block>
                    </Block>
                </View>
            </Modal>
        );
    }
    // mark as accepted
    accept=()=>{
        const bid = firebase.auth().currentUser.uid
        const cid = this.state.cid
        firebase.database().ref('/customers/'+cid+'/appointments/'+bid+'/BookingDetails/').update({
            status:'Accepted'
        })
        firebase.database().ref('/beauticians/'+bid+'/appointments/'+cid+'/BookingDetails/').update({
            status:'Accepted'
        },
        function (error) {
            if (error) {
                alert("There was a problem accepting the order.")
            } else {
                alert("Order Accepted successfully!")
            }
        });
    }
    // mark as completed
    complete=()=>{
        const bid = firebase.auth().currentUser.uid
        const cid = this.state.cid
        firebase.database().ref('/customers/'+cid+'/appointments/'+bid+'/BookingDetails/').update({
            status:'Completed'
        })
        firebase.database().ref('/beauticians/'+bid+'/appointments/'+cid+'/BookingDetails/').update({
            status:'Completed'
        },
        function (error) {
            if (error) {
                alert("There was a problem marking the order.")
            } else {
                alert("Order marked successfully!")
            }
        });
    }
    // mark as canceled
    cancel=()=>{
        const bid = firebase.auth().currentUser.uid
        const cid = this.state.cid
        firebase.database().ref('/customers/'+cid+'/appointments/'+bid+'/BookingDetails/').update({
            status:'Canceled'
        })
        firebase.database().ref('/beauticians/'+bid+'/appointments/'+cid+'/BookingDetails/').update({
            status:'Canceled'
        },
        function (error) {
            if (error) {
                alert("There was a problem canceling the order.")
            } else {
                alert("Order Canceled successfully!")
            }
        });
    }

    renderAppointments = () => {
        var uid = firebase.auth().currentUser.uid
        return Object.entries(this.state.appointment).map(item => {
            if (item[0] == uid) {
                return Object.values(item[1]).map(item => {
                    return (
                        <Text key={item} style={styles.listServices}>
                            <Text style={styles.bold}>Status: </Text>{item.status}{`  `}<Text style={styles.bold}>Time: </Text>{item.time}{` `}|{` `}{item.date}
                        </Text>
                    )
                })
            }
        })

    }
}
const styles = StyleSheet.create({
    button: {
        // marginBottom: theme.SIZES.BASE,
        width: width - (theme.SIZES.BASE * 18),
        margin:5
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    optionsText: {
        fontSize: theme.SIZES.BASE * 0.75,
        color: '#4A4A4A',
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: -0.29,
    },
    optionsButton: {
        width: 'auto',
        height: 34,
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
    },
    bold: {
        color: 'rgb(125, 226, 213)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userNameRow: {
        marginBottom: 5,
        paddingLeft: 5
    },
    name: {
        color: 'rgb(251, 248, 248)',
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    email: {
        color: 'rgb(251, 248, 248)',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        paddingBottom: 10
    },
    list1: {
        color: 'rgb(241, 242, 250)',
        fontSize: 16,
        paddingBottom: 10
    },
    listServices: {
        color: 'rgb(241, 232, 260)',
        fontSize: 16,
        paddingBottom: 15
    },
    userImage: {
        height: 150,
        width: 150,
        borderRadius: 10
    },
    modal: {
        alignSelf: 'center',
        borderRadius: 10,
    },
    modalView: {
        borderRadius: 10,
        height: height / 2 + 10,
        width: width,
        backgroundColor: 'rgba(88, 74, 74, 1)',
        justifyContent: 'center',
        alignItems: 'center'
    }

})
import React from 'react';
import { StyleSheet, Dimensions, ScrollView, ImageBackground, View, TouchableOpacity, Image } from 'react-native';
import ImageOverlay from "react-native-image-overlay";
import { Button, Block, Text, Input, theme } from 'galio-framework';
import bgImage from "../images/background.jpg";
import { Icon } from '../components';
import { HeaderHeight } from "../constants/utils";

const { width, height } = Dimensions.get('screen');

export default class beauticianInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            services: [],
            name: '',
            pic: 'none',
            address: '',
            about: '',
            mobile_no: '',
            gender: '',
            category: '',
            email: '',
            uid:''
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.setState({ name: navigation.getParam('username') });
        this.state.pic = navigation.getParam('profile_pic');
        this.state.address = navigation.getParam('address');
        this.state.about = navigation.getParam('about');
        this.state.services = navigation.getParam('services');
        this.state.mobile_no = navigation.getParam('mobile_no');
        this.state.gender = navigation.getParam('gender');
        this.state.category = navigation.getParam('category');
        this.state.email = navigation.getParam('email');
        this.state.uid = navigation.getParam('uid');
    }

    render() {
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer} blurRadius={8}>
                <ImageOverlay
                    height={height}
                    overlayColor="black"
                    overlayAlpha={0.8}>
                    <Block flex style={styles.profile}>
                    <View>
                        {this.renderHeader()}
                    </View>
                    <View style={{ flex: 1, backgroundColor: "rgba(88, 74, 74, 0.9)", borderRadius: 20 }}>
                        <ScrollView style={styles.scroll}>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={styles.AboutText}>About</Text>
                                <Text style={styles.about}>{this.state.about}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                                <Text style={styles.ServicesText}>Services</Text>
                                {this.renderServices()}
                            </View>
                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={styles.save}
                                    onPress={() => this.Booking()}
                                >
                                    <Text style={styles.text}>Book Now</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                    </Block>
                </ImageOverlay>
            </ImageBackground>
        );
    }
    renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.userRow}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={styles.userImage}
                            source={{
                                uri: this.state.pic,
                            }}
                        />
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
                    <View style={styles.userNameRow}>
                        <Text style={styles.userNameText}>{this.state.name}</Text>
                    </View>
                    <View style={styles.userNameRow}>
                        <Text style={styles.listSub1}>{this.state.category} Services</Text>
                    </View>
                    <View style={styles.userNameRow}>
                        <Text style={styles.listSub2}><Icon name="map-marker" family="font-awesome" color={theme.COLORS.NEUTRAL} size={18} />{` `}{this.state.address}</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderServices = () => {
        console.log("services"+this.state.services)
        return this.state.services.map((item) => {
            return (
                <Text key={item} style={styles.listServices}>
                    {item}
                </Text>
            )
        })
    }

    // head to the booking(calender page)
    Booking = () => {
        this.props.navigation.navigate('booking', {
            uid:this.state.uid,   
            name: this.state.name,
            pic: this.state.pic,
            category: this.state.category,
            address: this.state.address
        })
    }
}

const styles = StyleSheet.create({
    profile: {
        marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
        marginBottom: -HeaderHeight * 2,
    },
    footer: {
        paddingHorizontal: 28,
        justifyContent: 'flex-end',
        zIndex: 5,
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
    backgroundContainer: {
        width: width,
        height: height
    },
    userNameRow: {
        marginBottom: 5,
        paddingLeft: 5
    },
    userNameText: {
        color: 'rgb(251, 248, 248)',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    AboutText: {
        color: 'rgb(125, 226, 213)',
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 8,
        paddingTop: 10
    },
    ServicesText: {
        color: 'rgb(125, 226, 213)',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 8,
        paddingTop: 5
    },
    about: {
        color: 'rgb(251, 248, 248)',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'justify',
        paddingBottom: 10,
        width:width-20
    },
    email: {
        color: 'rgb(251, 248, 248)',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 10
    },
    userRow: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 5,
    },
    headerContainer: {
        width: width,
        alignContent: 'flex-start',
        paddingLeft: 10,
        marginBottom: 10,
        marginTop: 45,
    },
    listSub1: {
        fontSize: 16,
        fontWeight: "600",
        color: "rgb(251, 248, 248)"
    },
    listServices: {
        fontSize: 16,
        fontWeight: "500",
        color: "rgb(251, 248, 248)",
        paddingBottom: 5
    },
    listSub2: {
        fontSize: 16,
        fontWeight: "600",
        color: "rgb(251, 248, 248)"
    },
    userImage: {
        borderRadius: 10,
        height: 200,
        marginBottom: 10,
        width: 200,
    },
    scroll: {
        width: width,
    },
});

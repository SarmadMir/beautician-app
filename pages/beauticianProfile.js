import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Linking, Image, TextInput, AppState, ImageBackground, Platform, View, Button, TouchableOpacity } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import Textarea from 'react-native-textarea';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import RNPickerSelect from 'react-native-picker-select';
import CheckboxGroup from 'react-native-checkbox-group'
import { Icon } from '../components';
import { HeaderHeight } from "../constants/utils";
import firebase from 'firebase';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import Modal from 'react-native-modal';      // to load the extra view
import opencage from 'opencage-api-client';  // to get the string of address we used an api

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

export default class beauticianProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            name: '',
            dp: 'none',
            gender: '',
            mobNo: '',
            about: '',
            address: '',
            services: [],
            services1: [],
            category: 'Mark the services:(Please choose a category first)',
            done: false,
            geocoding: false,
            location: null,
            errorMessage: null,
            isLocationModalVisible: false,
            appState: AppState.currentState
        }
        this._isMounted = false;
    }

    // Unsubscribe all the state changes and remove all events
    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange)
        this._isMounted = false;
    }

    // Automatically Open settings for the user to enable
    openSetting = () => {
        if (Platform.OS == 'ios') {
            Linking.openURL('app-settings:')
        }
        else {
            IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);
        }
        this.setState({ openSetting: false })
    }

    render() {
        return (
            <Block flex style={styles.profile}>
                <Modal
                    style={{alignSelf:'center',borderRadius:10}}
                    onModalHide={this.state.openSetting ? this.openSetting : undefined}
                    isVisible={this.state.isLocationModalVisible}
                >
                    <View style={{borderRadius:10, height: 300, width: 300, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            onPress={() => this.setState({ isLocationModalVisible: false, openSetting: true })}
                            title="Enable Location Services" />
                    </View>
                </Modal>
                <Block flex >
                    <ImageBackground
                        source={{ uri: this.state.dp }}
                        style={styles.profileContainer}
                        imageStyle={styles.profileImage}>
                        <Block flex style={styles.profileDetails}>
                            <Block style={styles.profileTexts}>
                                <Text color="rgb(188, 178, 178)" size={28} style={styles.name}>{this.state.name}</Text>

                                <Block row style={{ paddingBottom: 4 }}>
                                    <Text color="white" size={16} muted style={styles.seller}>Beautician</Text>
                                </Block>
                                <Block row style={{ width: width, flexDirection: 'row' }}>
                                    <Text color={theme.COLORS.NEUTRAL} size={16} style={{ flex: 1, flexWrap: 'wrap' }}>
                                        <Icon name="map-marker" family="font-awesome" color={theme.COLORS.NEUTRAL} size={16} />
                                        {` `}{this.state.address}
                                    </Text>
                                </Block>

                            </Block>
                            <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient} />
                        </Block>
                    </ImageBackground>
                </Block>
                <Block center flex style={styles.options}>
                    <Icon name="camera-enhance" onPress={this._pickImage} family="material-community-icons" style={{ padding: 5 }} color={theme.COLORS.BLACK} size={22} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.services}>
                        <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
                            <TextInput
                                placeholder="Enter gender"
                                placeholderColor="#c4c3cb"
                                style={styles.FormTextInput}
                                onChangeText={(gender) => this.setState({ gender })}
                                value={this.state.gender}
                            />
                            <TextInput
                                maxLength={15}
                                placeholder="Enter Mobile No."
                                placeholderColor="#c4c3cb"
                                style={styles.FormTextInput}
                                onChangeText={(mobNo) => this.setState({ mobNo })}
                                value={this.state.mobNo}
                            />
                        </Block>
                        <Block row style={{ paddingVertical: 16, alignItems: 'baseline' }}>
                            <Text color={theme.COLORS.BLACK} size={16}>
                                <Icon name="map-marker" family="font-awesome" color={theme.COLORS.BLACK} size={16} />
                                {` `} Address
                        </Text>
                        </Block>
                        <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                            <Textarea
                                containerStyle={styles.textareaContainer}
                                style={styles.textarea}
                                onChangeText={(address) => this.setState({ address })}
                                defaultValue={this.state.address}
                                maxLength={60}
                                placeholder={'Edit your present Address..'}
                                placeholderTextColor={'#c7c7c7'}
                                underlineColorAndroid={'transparent'}
                            />
                        </Block>
                        <Block row style={{ paddingVertical: 16, alignItems: 'baseline' }}>
                            <Text size={16}>About</Text>
                        </Block>
                        <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                            <Textarea
                                containerStyle={styles.textareaContainer}
                                style={styles.textarea}
                                onChangeText={(about) => this.setState({ about })}
                                defaultValue={this.state.about}
                                maxLength={350}
                                placeholder={'Describe yourself. Tell customers why they should book you..'}
                                placeholderTextColor={'#c7c7c7'}
                                underlineColorAndroid={'transparent'}
                            />
                            <Text style={styles.service} size={16}>Your Services</Text>
                            <RNPickerSelect
                                placeholder={{
                                    label: 'Select a Category',
                                    value: null,
                                    color: '#9EA0A4',
                                }}
                                value={this.state.category}
                                style={pickerSelectStyles}
                                onValueChange={value => this.selectService(value)}
                                items={[
                                    { label: 'Hair Care', value: 'Hair Care' },
                                    { label: 'Makeup', value: 'Makeup' },
                                    { label: 'Facial', value: 'Facial' },
                                    { label: 'Threading And Face Wax', value: 'Threading And Face Wax' },
                                    { label: 'Nails', value: 'Nails' },
                                    { label: 'Scrub', value: 'Scrub' },

                                ]}
                            />
                            <Text style={styles.service} size={16}>{this.state.category}</Text>
                            <CheckboxGroup
                                callback={(selected) => this.setState({ services1: selected })}
                                iconColor={"#00a2dd"}
                                value={this.state.services1}
                                iconSize={30}
                                checkedIcon="ios-checkbox-outline"
                                uncheckedIcon="ios-square-outline"
                                checkboxes={this.state.services}
                                labelStyle={{
                                    color: '#333',
                                    padding: 1,
                                    paddingLeft: 5,
                                    paddingRight: 15,
                                    fontSize: 18,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#878787',
                                    backgroundColor: '#fafafa',
                                    margin: 2

                                }}
                                rowStyle={{
                                    flexDirection: 'row'
                                }}
                                rowDirection={"column"}
                            />
                        </Block>
                        <Block style={styles.footer}>
                            <TouchableOpacity
                                style={styles.save}
                                onPress={() => this.saveProfile()}
                            >
                                <Text style={styles.text}>Save Profile</Text>
                            </TouchableOpacity>
                        </Block>
                    </ScrollView>
                </Block>
            </Block>
        );
    }

    // Save/Update the Profile Data into the database
    saveProfile() {
        firebase.database().ref('/beauticians/' + this.state.uid).update({
                profile_picture: this.state.dp,
                gender: this.state.gender,
                mobile_no: this.state.mobNo,
                about: this.state.about,
                category: this.state.category,
                services: this.state.services1,
                address: this.state.address
            },
                function (error) {
                    if (error) {
                        alert("There was a problem saving your data.")
                    } else {
                        alert("Data saved successfully!!")
                    }
                });
    }

    // After comming from the settings we gotta handle the state change and update the app accordingly
    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active') {
            console.log('App has come to the foreground!')
            this._getLocationAsync();
        }
        this.setState({ appState: nextAppState });
    }

    //on load ask for permissions of camera roll as well as locations & also load the user data
    componentDidMount() {
        this._isMounted = true;
        AppState.addEventListener('change', this.handleAppStateChange)
        this.performLocation();
        this.getPermissionAsync();
        var user = firebase.auth().currentUser;
        // console.log(user)
        this.setState({ uid: user.uid, name: user.displayName, dp: user.photoURL })
        // console.log("this"+user.uid)
        firebase.database().ref('/beauticians/' + user.uid).on('value', snapshot => {
            this.setState({
                name: snapshot.val().username,
                address: snapshot.val().address,
                about: snapshot.val().about,
                dp: snapshot.val().profile_picture,
                gender: snapshot.val().gender,
                mobNo: snapshot.val().mobile_no,
                category: snapshot.val().category,
                services1: snapshot.val().services
            })
        }
        );
    }

    // Check for iOS and android Platfrom firstly
    performLocation() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    // for getting the address in String format
    reverseGeocode = (latLang) => {
        const key = 'a4a5bbee66104b399e067fe5763fca71';
        this.setState({ geocoding: true });
        opencage.geocode({ key, q: latLang }).then(response => {
            result = response.results[0];
            console.log("Geocode address.." + result.formatted);
            this.setState({ address: result.formatted, geocoding: false });
        });
    }

    // Permissions to access location and set the address accordingly
    _getLocationAsync = async () => {
        try {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                this.setState({
                    errorMessage: 'Permission to access location was denied',
                });
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            let latLang = location.coords.latitude + ',' + location.coords.longitude
            console.log("location.." + latLang)
            this.reverseGeocode(latLang)
        }
        catch (error) {
            let status = Location.getProviderStatusAsync()
            if (!status.locationServicesEnabled) {
                this.setState({ isLocationModalVisible: true })
            }
        }
    };

    // upload image to the firebase storage and create a reference URL
    uploadImage = async (uri) => {

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        var randomNumber = Math.floor(Math.random() * 1000) + 1;
        const ref = firebase.storage().ref().child("beauticians/" + randomNumber);
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();

        return await snapshot.ref.getDownloadURL();

    }

    //Permissions to change profile pic
    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    //pick image function
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        console.log(result);
        if (!result.cancelled) 
        {
            var uploadUrl = await this.uploadImage(result.uri)
            this._isMounted && this.setState({ dp: uploadUrl })
        }
        
    };

    //select service based on the picker
    selectService = (value) => {
        this.setState({ category: value });
        switch (value) {
            case 'Hair Care':
                return (
                    this.setState({
                        services:
                            [
                                {
                                    label: "Hair Wash",
                                    value: "Hair Wash",
                                },
                                {
                                    label: "Hair Color",
                                    value: "Hair Color",
                                },
                                {
                                    label: "Hair Straightening",
                                    value: "Hair Straightening",
                                },
                                {
                                    label: "Hair Style",
                                    value: "Hair Style",
                                },
                                {
                                    label: "Hair Cutting",
                                    value: "Hair Cutting",
                                },

                            ]
                    })
                );
            case 'Makeup':
                return (
                    this.setState({
                        services:
                            [
                                {
                                    label: "Engagement/Bridal Makeup",
                                    value: "Engagement/Bridal Makeup",
                                },
                                {
                                    label: "Eye Makeup",
                                    value: "Eye Makeup",
                                },
                                {
                                    label: "Eyelash Application",
                                    value: "Eyelash Application",
                                },
                                {
                                    label: "Eyelashes And Eyelashes Application",
                                    value: "Eyelashes And Eyelashes Application",
                                },
                                {
                                    label: "Party Makeup",
                                    value: "Party Makeup",
                                },
                                {
                                    label: "Soft Makeup",
                                    value: "Soft Makeup",
                                },
                            ]
                    })
                );
            case 'Facial':
                return (
                    this.setState({
                        services:
                            [
                                {
                                    label: "Cleanser",
                                    value: "Cleanser",
                                },
                                {
                                    label: "Face Polisher",
                                    value: "Face Polisher",
                                },
                                {
                                    label: "Dermaclear Facial",
                                    value: "Dermaclear Facial",
                                },
                                {
                                    label: "Thalgo Facial",
                                    value: "Thalgo Facial",
                                },
                                {
                                    label: "Janssen Whitening Facial",
                                    value: "Janssen Whitening Facial",
                                },
                            ]
                    })
                );
            case 'Threading And Face Wax':
                return (
                    this.setState({
                        services:
                            [
                                {
                                    label: "Eyebrows(threading)",
                                    value: "Eyebrows(threading)",
                                },
                                {
                                    label: "Full face Threading",
                                    value: "Full face Threading",
                                },
                                {
                                    label: "Full face Hot wax",
                                    value: "Full face Hot wax",
                                },
                                {
                                    label: "Per part Threading",
                                    value: "Per part Threading",
                                },
                                {
                                    label: "Per part Hot wax",
                                    value: "Per part Hot wax",
                                },


                            ]
                    })
                );
            case 'Nails':
                return (
                    this.setState({
                        services:
                            [
                                {
                                    label: "Manicure",
                                    value: "Manicure",
                                },
                                {
                                    label: "Pedicure",
                                    value: "Pedicure",
                                },
                            ]
                    })
                );
            case 'Scrub':
                return (
                    this.setState({
                        services:
                            [
                                {
                                    label: "Nutty Almond Scrub",
                                    value: "Nutty Almond Scrub",
                                },
                                {
                                    label: "Ubtan Scrub",
                                    value: "Ubtan Scrub",
                                },
                                {
                                    label: "Coffee Scrub",
                                    value: "Coffee Scrub",
                                },
                            ]
                    })
                );
            default:
                return null;
        }
    }
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
const styles = StyleSheet.create({
    footer: {
        paddingHorizontal: 28,
        justifyContent: 'flex-end',
        zIndex: 5
    },
    text: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 18,
        textAlign: 'center',
    },
    save: {
        height: 45,
        borderRadius: 15,
        backgroundColor: '#4B1958',
        justifyContent: 'center',
        marginTop: 20
    },
    picker: {
        alignSelf: 'stretch',
        backgroundColor: '#7d59ba',
        paddingHorizontal: 20,
        paddingVertical: 18,
        margin: 10,
        borderRadius: 4,
    },
    pickerText: {
        color: 'white',
    },
    service: {
        marginTop: 10,
        marginBottom: 10
    },
    textareaContainer: {
        height: 100,
        padding: 5,
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: 80,
        fontSize: 14,
        color: '#333',
    },
    FormTextInput: {
        textAlign: 'left',
        minWidth: '40%',
        height: 40,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        paddingRight: 10,
    },
    profile: {
        marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
        marginBottom: -HeaderHeight * 2,
    },
    profileImage: {
        width: width * 1.1,
        height: 'auto',
    },
    profileContainer: {
        width: width,
        height: height / 2.5,
    },
    profileDetails: {
        paddingTop: theme.SIZES.BASE * 4,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    profileTexts: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE * 2,
        zIndex: 2
    },
    name: {
        padding: 5,
        paddingLeft: 5,
        borderRadius: 8,
        borderWidth: 0,
        borderColor: 'rgba(181, 170, 170, 0.18)',
        backgroundColor: 'rgba(181, 170, 170, 0.18)',
        marginLeft: -5,
        width: '45%',
        paddingBottom: 4
    },
    seller: {
        marginRight: theme.SIZES.BASE / 2,
    },
    options: {
        width: width,
        height: height,
        position: 'relative',
        paddingTop: theme.SIZES.BASE * -2,
        marginHorizontal: theme.SIZES.BASE * -2,
        marginTop: -theme.SIZES.BASE * 18,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        shadowOpacity: 0.2,
        zIndex: 2,
    },
    thumb: {
        borderRadius: 4,
        marginVertical: 4,
        alignSelf: 'center',
        width: thumbMeasure,
        height: thumbMeasure
    },
    gradient: {
        zIndex: 1,
        left: 0,
        right: 0,
        bottom: 0,
        height: '30%',
        position: 'absolute',
    },
    services: {
        width: width - theme.SIZES.BASE * 1,
        paddingVertical: theme.SIZES.BASE * 9,
        paddingTop: theme.SIZES.BASE * -9,
    },
});

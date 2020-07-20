import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Linking, AppState, Image, TextInput, ImageBackground, Platform, View, Button, TouchableOpacity, RecyclerViewBackedScrollView } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import Textarea from 'react-native-textarea';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Icon } from '../components';
import { HeaderHeight } from "../constants/utils";
import firebase from 'firebase';
import { IntentLauncherAndroid } from 'expo';
import * as Location from 'expo-location';
import Modal from 'react-native-modal';     // to load the extra view
import opencage from 'opencage-api-client';  // to get the string of address we used an api

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

export default class customerProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            name: '',
            dp: 'none',
            gender: '',
            mobNo: '',
            address: '',
            geocoding: false,
            location: null,
            errorMessage: null,
            isLocationModalVisible: false,
            appState: AppState.currentState,
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
            IntentLauncherAndroid.startActivityAsync(
                IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
            )
        }
        this.setState({ openSetting: false })
    }

    render() {
        return (
            <Block flex style={styles.profile}>
                <Modal
                    style={{ alignSelf: 'center', borderRadius: 10 }}
                    onModalHide={this.state.openSetting ? this.openSetting : undefined}
                    isVisible={this.state.isLocationModalVisible}
                >
                    <View style={{ borderRadius: 10, height: 300, width: 300, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
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
                                    <Text color="white" size={16} muted style={styles.seller}>Customer</Text>
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
                                placeholder="Edit Gender"
                                placeholderColor="#c4c3cb"
                                style={styles.FormTextInput}
                                onChangeText={(gender) => this.setState({ gender })}
                                value={this.state.gender}
                            />
                            <TextInput
                                maxLength={15}
                                placeholder="Edit Mobile number"
                                placeholderColor="#c4c3cb"
                                style={styles.FormTextInput}
                                onChangeText={(mobNo) => this.setState({ mobNo })}
                                value={this.state.mobNo}

                            />
                        </Block>
                        <Block row style={{ paddingVertical: 16, alignItems: 'baseline', paddingLeft: 18 }}>
                            <Text color={theme.COLORS.BLACK} size={18}>
                                <Icon name="map-marker" family="font-awesome" color={theme.COLORS.BLACK} size={16} />
                                {` `}Address
                        </Text>
                        </Block>
                        <Block style={{ paddingBottom: -HeaderHeight * 2, paddingLeft: 18 }}>
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
        firebase.database().ref('/customers/' + this.state.uid).update({
            profile_picture: this.state.dp,
            gender: this.state.gender,
            mobile_no: this.state.mobNo,
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
        firebase.database().ref('/customers/' + user.uid).on('value', snapshot => {
            this.setState({
                name: snapshot.val().username,
                address: snapshot.val().address,
                dp: snapshot.val().profile_picture,
                gender: snapshot.val().gender,
                mobNo: snapshot.val().mobile_no
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

    // for getting the address
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
        const ref = firebase.storage().ref().child("customers/" + randomNumber);
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
            var uploadUrl = await this.uploadImage(result.uri);
            this._isMounted && this.setState({ dp: uploadUrl })
        }
    };
}

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
    textareaContainer: {
        height: 100,
        padding: 5,
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: 100,
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
        borderRadius: 10,
        borderWidth: 1,
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

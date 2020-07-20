import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, ImageBackground, Image, TextInput, Dimensions, AsyncStorage } from 'react-native';
import bgImage from "../images/background.jpg";
import logo from "../images/logo.png";
import Icon from 'react-native-vector-icons/Ionicons'
import ImageOverlay from "react-native-image-overlay";
import * as Google  from 'expo-google-app-auth';
import firebase from 'firebase';

const { height: HEIGHT} = Dimensions.get('window')
const { width: WIDTH } = Dimensions.get('window')

export default class customerLog extends React.Component{
    constructor(props){
        super(props)
        this.state={
          email: '',
          password: '',  
          showPass: true,
          press: false
        }
      }
      showPass = () =>{
        if (this.state.press == false){
          this.setState({showPass: false, press: true })
        } else {
          this.setState({showPass: true, press: false })
        }
      }

    //Check if user is already signed in. so no reauth
      isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      }

      //perform when user clicks Sign In
      onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
              );
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential)
            .then(function(result){
              console.log("User signed In");
              if(result.additionalUserInfo.isNewUser)
              {
              firebase.database()
              .ref('/customers/'+result.user.uid)
              .set({
                email: result.user.email,
                uid: result.user.uid,
                profile_picture: result.additionalUserInfo.profile.picture,
                locale: result.additionalUserInfo.profile.locale,
                username: result.additionalUserInfo.profile.given_name+' '+result.additionalUserInfo.profile.family_name,
                created_at: Date.now(),
                role:'Customer',
                approved:'1'
              })
            }else{
              firebase.database()
              .ref('/customers/'+result.user.uid).update({
                last_logged_in:Date.now()
              })
            }
          })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this)
        );
      }

      //sign In with Google
      signInWithGoogleAsync = async () => {
        try {
          console.log("Google pressed")
          const result = await Google.logInAsync({
            // androidClientId: YOUR_CLIENT_ID_HERE,
            iosClientId: '1035131740354-khtchskmspmje22dc5oeo5hmo9qmume3.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            this.onSignIn(result);
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }

      //sign In from app 
      loginUser = (email,password)=>{
        try{
          firebase.auth().signInWithEmailAndPassword(email,password).then(function(user){
            console.log(user)
          })
        }
        catch(error)
        {
          console.log(error.toString())
        }
      }
      
      render(){
      return (
        <ImageBackground source={bgImage} style={styles.backgroundContainer}>
          <ImageOverlay
          height={HEIGHT} 
          overlayColor="black"
          overlayAlpha={0.5}>
          <View style={styles.logoContainer} >
            <Image source={logo} style={styles.logo} />
            <Text style={styles.logoText}>Sign in now</Text>
          </View>
    
          <View style={styles.inputContainer}>
            <Icon name={'ios-mail'} size={28} color={'rgba(18, 11, 11,0.9)'}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'Email'}
              onChangeText={(email)=>this.setState({email})}
              value={this.state.email}
              placeholderTextColor={'rgba(35, 15, 15,1)'}
              underLineColorAndriod='transparent'
              autoCapitalize='none'
            />
          </View>
    
          <View style={styles.inputContainer}>
            <Icon name={'ios-lock'} size={28} color={'rgba(18, 11, 11,0.9)'}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'Password'}
              onChangeText={(password)=>this.setState({password})}
              value={this.state.password}
              secureTextEntry={this.state.showPass}
              placeholderTextColor={'rgba(35, 15, 15,1)'}
              underLineColorAndriod='transparent'
            />

            <TouchableOpacity style={styles.btneye}
              onPress={this.showPass.bind(this)}>
              <Icon name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'} 
              size={26} color={'rgba(18, 11, 11,0.9)'}
              />
            </TouchableOpacity>
          </View>

    
          <TouchableOpacity 
          style={styles.btnReg}
          onPress={()=>this.loginUser(this.state.email,this.state.password)}
          >
            <Text style={styles.text}>Sign in</Text>
          </TouchableOpacity>

          <View style={styles.view3}>
          <Text autoCapitalize="words" style={styles.buttontext}>
            New User?
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('customerReg')}
          >
            <Text style={styles.signInTxt}>Register now</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.btnReg1}
          onPress={()=>this.signInWithGoogleAsync()}
          >
             <Icon name={'logo-google'} size={28} color={'rgba(18, 11, 11,0.9)'}
              style={styles.inputIcon} />
            <Text style={styles.text}>Sign in with Google</Text>
          </TouchableOpacity>

        </ImageOverlay>
        </ImageBackground>
      );
    }
    }
    
    const styles = StyleSheet.create({
      backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo: {
        width: 130,
        height: 130
      },
      logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
        marginTop: -100
      },
      logoText: {
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
        marginTop: 20,
        marginBottom:-25
      },
      input: {
        width: WIDTH - 65,
        height: 40,
        borderRadius: 25,
        fontSize: 16,
        paddingLeft: 45,
        backgroundColor: 'rgba(228, 209, 209,0.9)',
        color: 'rgba(35, 15, 15,1)',
        marginHorizontal: 25
      },
      inputIcon: {
        position: 'absolute',
        top: 8,
        left: 37,
        zIndex:2
      },
      inputContainer:{
        marginTop:10
      },
      btneye:{
        position: 'absolute',
        top: 8,
        right: 37
      },
      btnReg:{
        width: WIDTH - 55,
        height: 45,
        borderRadius: 15,
        backgroundColor: '#7d59ba',
        justifyContent:'center',
        marginTop: 20
      },
      btnReg1:{
        width: WIDTH - 55,
        height: 45,
        borderRadius: 15,
        backgroundColor: '#4285f4',
        justifyContent:'center',
        marginTop: 20
      },
      text:{
        color: 'rgba(255,255,255,0.8)',
        fontSize:18,
        textAlign: 'center',
      },
      view3: {
        alignItems: 'center',
        marginTop: 10,
      },
      buttontext: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'normal',
        marginTop: 10,
      },
      signInTxt: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        marginTop: 10,
        fontStyle: 'italic'
      }
    });
    
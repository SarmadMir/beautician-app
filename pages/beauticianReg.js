import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, ImageBackground, Image, TextInput, Dimensions, AsyncStorage } from 'react-native';
import bgImage from "../images/background.jpg";
import logo from "../images/logo.png";
import Icon from 'react-native-vector-icons/Ionicons'
import ImageOverlay from "react-native-image-overlay";
import * as firebase from 'firebase';

const { height: HEIGHT} = Dimensions.get('window')
const { width: WIDTH } = Dimensions.get('window')

export default class beauticianReg extends React.Component{
    constructor(props){
        super(props)
        this.state={
          username: '',
          email: '',
          password: '',  
          confirmpass: '',
          id:'',
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

      //Register the user in the database as well as in authentication
      signUpUser = (email,password)=>{
        try{
          if(this.state.username == '')
          {
            alert("Please Enter your username")
            return;
          }
          if(this.state.id == '')
          {
            alert("Please Enter your ID/SSN")
            return;
          }
          if(this.state.email == '')
          {
            alert("Please Enter your email")
            return;
          }
          if(this.state.password.length<6)
          {
            alert("Password should have atleast 6 characters")
            return;
          }
          if(this.state.password != this.state.confirmpass )
          {
            alert("Passwords donot match")
            return;
          }
          firebase.auth().createUserWithEmailAndPassword(email,password)
          .then(function(result){
            console.log("User created");
            if(result.additionalUserInfo.isNewUser)
            {
            firebase.database()
            .ref('/beauticians/'+result.user.uid)
            .set({
              email: result.user.email,
              uid: result.user.uid,
              created_at: Date.now(),
              role:'Beautician',
              approved:'0',
              username:this.state.username,
              id:this.state.id,
            })
          }else{
            firebase.database()
            .ref('/beauticians/'+result.user.uid).update({
              last_logged_in:Date.now()
            })
          }
        }.bind(this))
        }
        catch(error){
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
            <Text style={styles.logoText}>Register now</Text>
          </View>
    
          <View style={styles.inputContainer}>
            <Icon name={'ios-person'} size={28} color={'rgba(35, 15, 15,1)'}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'Username'}
              onChangeText={(username)=>this.setState({username})}
              value={this.state.username}
              placeholderTextColor={'rgba(35, 15, 15,1)'}
              underLineColorAndriod='transparent'
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name={'ios-card'} size={28} color={'rgba(35, 15, 15,1)'}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'ID/SSN'}
              onChangeText={(id)=>this.setState({id})}
              value={this.state.id}
              placeholderTextColor={'rgba(35, 15, 15,1)'}
              underLineColorAndriod='transparent'
              autoCapitalize='none'
            />
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
              autoCapitalize='none'
            />
            <TouchableOpacity style={styles.btneye}
              onPress={this.showPass.bind(this)}>
              <Icon name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'} 
              size={26} color={'rgba(18, 11, 11,0.9)'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon name={'ios-lock'} size={28} color={'rgba(18, 11, 11,0.9)'}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'Confirm Password'}
              onChangeText={(confirmpass)=>this.setState({confirmpass})}
              value={this.state.confirmpass}
              placeholderTextColor={'rgba(35, 15, 15,1)'}
              underLineColorAndriod='transparent'
              autoCapitalize='none'
            />
          </View>
    
          <TouchableOpacity 
          style={styles.btnReg}
          onPress={()=>this.signUpUser(this.state.email,this.state.password)}
          >
            <Text style={styles.text}>Register now</Text>
          </TouchableOpacity>

          <View style={styles.view3}>
          <Text autoCapitalize="words" style={styles.buttontext}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('beauticianLog')}
          >
            <Text style={styles.signInTxt}>Sign In</Text>
          </TouchableOpacity>
        </View>

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
        marginTop: -80
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
    
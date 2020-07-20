import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image,Dimensions, ImageBackground,} from 'react-native';
import ImageOverlay from "react-native-image-overlay";
import bgImage from "../images/background.jpg";
import logo from "../images/logo.png";
Expo.Asset.fromModule(require("../images/background.jpg")).downloadAsync()

const { width: WIDTH } = Dimensions.get('window')
const { height: HEIGHT} = Dimensions.get('window')

export default class welcome extends React.Component{
      render(){
      return (
        <ImageBackground source={bgImage} style={styles.backgroundContainer}>
        <ImageOverlay
          height={HEIGHT} 
          overlayColor="black"
          overlayAlpha={0.5}>

          <View style={styles.logoContainer} >
            <Text style={styles.Text1}>WELCOME!</Text>
            <Text style={styles.Text2}>Are you a</Text>
          </View>
    
          <TouchableOpacity 
          style={styles.btnBeautician}
          onPress={()=>this.props.navigation.navigate('bLoadingScreen')}
          >
            <Text style={styles.text}>Beautician</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          style={styles.btnCustomer}
          onPress={()=>this.props.navigation.navigate('cLoadingScreen')}
          >
            <Text style={styles.text}>Customer</Text>
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
      logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
        marginTop: -80
      },
      Text1: {
        color: 'rgba(238, 235, 235, 0.90)',
        fontSize: 60,
        fontWeight: '800',
        marginTop: 10
      },
      Text2: {
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
        marginTop: 10,
      },
      btnBeautician:{
        width: WIDTH - 80,
        height: 45,
        borderRadius: 10,
        fontSize: 18,
        backgroundColor: '#7d59ba',
        justifyContent:'center',
        marginTop: 0
      }, 
      btnCustomer:{
        width: WIDTH - 80,
        height: 45,
        borderRadius: 10,
        fontSize: 18,
        backgroundColor: '#7d59ba',
        justifyContent:'center',
        marginTop: 20
      },
      text:{
        color: 'rgba(255,255,255,0.8)',
        fontSize:22,
        textAlign: 'center',
      }
    });
    
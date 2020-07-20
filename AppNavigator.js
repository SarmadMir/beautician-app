import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator,DrawerNavigatorItems } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { View, ActivityIndicator, StatusBar, AsyncStorage, StyleSheet } from 'react-native';

import BHeader from './components/beauticianHeader'; // beautician header
import CHeader from './components/customerHeader'; // customer header

import { Drawer } from './components/';
import Menu from './Menu/Menu';
import CuMenu from './Menu/CuMenu';
import { Easing, Animated, Platform } from 'react-native';
import { Block, Text, theme } from "galio-framework";

//welcome
import welcome from './pages/welcome';
//beautician
import beauticianReg from './pages/beauticianReg';
import beauticianLog from './pages/beauticianLog';
import beauticianProfile from './pages/beauticianProfile';
import beauticianHome from './pages/beauticianHome';
//customer
import customerReg from './pages/customerReg';
import customerLog from './pages/customerLog';
import customerHome from './pages/customerHome';
import customerProfile from './pages/customerProfile';
//customer Appointments
import Appointments from './pages/Appointments';
//beauticians available
import beauticians from './pages/beauticians';
//beauticianInfo
import beauticianInfo from './pages/beauticianInfo';
// booking beauticians(calender)
import booking from './pages/booking';
//category
import category from './pages/category';
//Loading screens
import bLoadingScreen from './pages/bLoadingScreen';
import cLoadingScreen from './pages/cLoadingScreen';
//initialize firebase
import firebase from 'firebase';
import {firebaseConfig} from './db/firebase';
firebase.initializeApp(firebaseConfig);

//transition
const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index
    const width = layout.initWidth
    
    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    })
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1],
    })
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0],
    })

    const scaleWithOpacity = { opacity }
    const screenName = "Search"

    if (screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] }
  }
})


//NAVIGATION
//beauticianProfile
const ProfileStack = createStackNavigator({
  Profile: {
    screen: beauticianProfile,
    navigationOptions: ({ navigation }) => ({
      header: <BHeader white transparent title="Profile" navigation={navigation} />,
      headerTransparent: true,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
});

//beauticianHome
const HomeStack = createStackNavigator({
  Home: {
    screen: beauticianHome,
    navigationOptions: ({navigation}) => ({
      header: <BHeader search tabs title="Home" navigation={navigation} />,
    })
  },
},
{
  cardStyle: { 
    backgroundColor: '#EEEEEE', //this is the backgroundColor for the app
  },
  transitionConfig,
});

//customer Profile
const CProfileStack = createStackNavigator({
  Profile: {
    screen: customerProfile,
    navigationOptions: ({ navigation }) => ({
      header: <CHeader white transparent title="Profile" navigation={navigation} />,
      headerTransparent: true,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
});

//customer Home
const CHomeStack = createStackNavigator({
  Home: {
    screen: customerHome,
    navigationOptions: ({navigation}) => ({
      header: <CHeader search tabs title="Home" navigation={navigation} />,
    })
  },
  Appointments: {
    screen: Appointments,
    navigationOptions: 
      {
        title: 'Appointments',
        headerStyle: {
          backgroundColor: 'rgba(84, 79, 79, 0.88)',
          zIndex:5
        },
        headerTintColor: 'rgb(251, 248, 248)',
        headerTitleStyle: {
        fontWeight: 'bold',
        },
      },
  },
  beauticians: {
    screen: beauticians,
    navigationOptions: 
      {
        title: 'Beauticians',
        headerStyle: {
          backgroundColor: 'rgba(84, 79, 79, 0.88)',
        },
        headerTintColor: 'rgb(251, 248, 248)',
        headerTitleStyle: {
        fontWeight: 'bold',
        },
      },
  },
  beauticianInfo: {
    screen: beauticianInfo,
    navigationOptions: 
      {
        headerStyle: {
          backgroundColor: 'rgba(84, 79, 79, 0.88)',
        },
        headerTintColor: 'rgb(251, 248, 248)',
      },
  },
  booking: {
    screen: booking,
    navigationOptions: 
      {
        headerStyle: {
          backgroundColor: 'rgba(84, 79, 79, 0.88)',
        },
        headerTintColor: 'rgb(251, 248, 248)',
      },
  },
  category:{screen:category,
    navigationOptions: 
    {
      headerStyle: {
        backgroundColor: 'rgba(84, 79, 79, 0.88)',
      },
      headerTintColor: 'rgb(251, 248, 248)',
      headerTitleStyle: {
      fontWeight: 'bold',
      },
    },
  },
},
{
  cardStyle: { 
    backgroundColor: '#EEEEEE',         //this is the backgroundColor for the app
  },
  transitionConfig,
});

//Drawer For beautician
const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Home" title="Home" />
        )
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Profile" title="Profile" />
        ),
      }),
    },
    MenuDivider: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: () => <Block style={{marginVertical: 8}}><Text>{` `}</Text></Block>,
      },
    },
  },
  Menu
);

//Drawer For customer
const AppDrawerNavigatorC = createDrawerNavigator(
  {
    Home: {
      screen: CHomeStack,
      navigationOptions: {
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Home" title="Home" />
        )
      }
    },
    Profile: {
      screen: CProfileStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Profile" title="Profile" />
        ),
      }),
    },
    MenuDivider: {
      screen: CHomeStack,
      navigationOptions: {
        drawerLabel: () => <Block style={{marginVertical: 8}}><Text>{` `}</Text></Block>,
      },
    },
  },
  CuMenu,
);

//Switch Navigation for screens where we cant go back once entered.
const AppNavigator = createSwitchNavigator(
  {
    welcome: {
      screen: welcome,
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }
    },

    bLoadingScreen: { screen: bLoadingScreen, 
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }
    },
    beauticianReg: { screen: beauticianReg, 
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }
    },
    beauticianLog: { screen: beauticianLog, 
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }},
    cLoadingScreen: { screen: cLoadingScreen, 
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }
    },
    customerReg: { screen: customerReg ,
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }},
    customerLog: { screen: customerLog ,
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }},
    customerHome:{screen:AppDrawerNavigatorC,
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }},

    customerProfile:{screen:AppDrawerNavigatorC,
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }},

    beauticianHome:{screen:AppDrawerNavigator,
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }},
    beauticianProfile:{screen:AppDrawerNavigator,
      navigationOptions: 
      {
        headerLeft: null,
        header: null,
      }},
  },
  {
    initialRouteName: 'welcome',
  }
);

const App = createAppContainer(AppNavigator);
export default App;

// const AuthStack = createStackNavigator ({beauticianLog: { screen: beauticianLog,
//   navigationOptions:{
//   headerLeft: null,
//   header: null,}
//   }} )

// class AuthLoadingScreen extends React.Component {
//   constructor (props){
//     super(props)
//     this._loadData();
//   }

//   render(){
//     return(
//       <View style={styles.container}>
//         <ActivityIndicator/>
//         <StatusBar barStyle='default'/>
//       </View>
//     );
//   }

//   _loadData = async()=>{
//     const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
//     this.props.navigation.navigate(isLoggedIn !== '1'? 'Auth' : 'App') 
//   }

// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     }
//   });

//   export default createAppContainer(
//     createSwitchNavigator(
//       {
//         AuthLoading: AuthLoadingScreen,
//         App: AppNavigator,
//         Auth: AuthStack,
//       },
//       {
//         initialRouteName: 'App',
//       }
//     )
//   );
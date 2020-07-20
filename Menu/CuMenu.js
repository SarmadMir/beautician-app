import React from "react";
import { DrawerItems } from 'react-navigation-drawer';
import { TouchableWithoutFeedback, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { Block, Text, theme } from "galio-framework";
import Icon1 from 'react-native-vector-icons/Ionicons'
import firebase from 'firebase';

const { width } = Dimensions.get('screen');

class CMenuHeader extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {  
      name:'',
      avatar:'none'
    }
  }

  componentDidMount=() =>
  {
    firebase.database().ref('/customers/' + firebase.auth().currentUser.uid).on('value', snapshot=> 
    {
      this.setState({
        name:snapshot.val().username,
        avatar:snapshot.val().profile_picture})
    })
  }

  render(){
    const { navigation } = this.props;
    return(
      <Block flex={0.2} style={styles.header}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile')} >
        <Block style={styles.profile}>
          <Image source={{ uri: this.state.avatar }} style={styles.avatar} />
          <Text h5 color="white">
            {this.state.name}
          </Text>
        </Block>
      </TouchableWithoutFeedback>
      <Block row>
        <Text size={16} muted style={styles.customer}>Customer</Text>
      </Block>
    </Block>
    );
  }
}

const Drawer = (props) => (
  <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
    <CMenuHeader {...props}/>
    <Block flex>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <DrawerItems {...props} />
      </ScrollView>
    </Block>
    <Block flex={0.2} style={styles.footer}>
    <TouchableOpacity 
      style={styles.logout}
      onPress={()=> firebase.auth().signOut()}
    >
    <Icon1 name={'ios-log-out'} size={24} color={'rgba(255,255,255,0.8)'}
     style={styles.Icon1}/>
    <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
    </Block>
  </Block>
);

const CuMenu = {
  contentComponent: props => <Drawer {...props} />,
  drawerBackgroundColor: 'white',
  drawerWidth: width * 0.8,
  contentOptions: {
    activeTintColor: 'white',
    inactiveTintColor: '#000',
    activeBackgroundColor: 'transparent',
    itemStyle: {
      width: width * 0.75,
      backgroundColor: 'transparent',
    },
    labelStyle: {
      fontSize: 18,
      marginLeft: 12,
      fontWeight: 'normal',
    },
    itemsContainerStyle: {
      paddingVertical: 16,
      paddingHorizonal: 12,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4B1958',
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    justifyContent: 'flex-end',
    marginBottom: theme.SIZES.BASE / 2,
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
  },
  customer: {
    marginRight: 16,
  },
  Icon1: {
    position: 'absolute',
    zIndex:2,
    left:20
  },
  text:{
    color: 'rgba(255,255,255,0.8)',
    fontSize:18,
    textAlign: 'center',
  },
  logout:{
    height: 45,
    borderRadius: 15,
    backgroundColor: '#4B1958',
    justifyContent:'center',
    marginTop: 20
  },
});

export default CuMenu;

import React, { useReducer } from 'react';
import { StyleSheet, Dimensions, ScrollView, ImageBackground, View } from 'react-native';
import ImageOverlay from "react-native-image-overlay";
import { Button, Block, Text, Input, theme } from 'galio-framework';
import bgImage from "../images/background.jpg";
import { Service } from '../components/';
import FlashMessage, { showMessage } from "react-native-flash-message";
import firebase from 'firebase';
// service categories
import services from '../constants/services';

const { width } = Dimensions.get('screen');

export default class customerHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uid: '',
    }
  }

  renderTabs = () => {
    const { navigation } = this.props;
    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Appointments')}>
          <Block row middle>
            <Icon name="bookmark" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Appointments</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('beauticians')}>
          <Block row middle>
            <Icon size={16} name="flat-brush" family="entypo" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Beauticians</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderServices = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.services}>
        <Block flex>
          <Service services={services[0]} horizontal />
          <Service services={services[1]} horizontal />
          <Service services={services[2]} horizontal />
          <Service services={services[3]} horizontal />
          <Service services={services[4]} horizontal />
          <Service services={services[5]} horizontal />
        </Block>
      </ScrollView>
    )
  }

  //Check if the user is approved or not on page load
  componentDidMount() {
    var user = firebase.auth().currentUser;
    this.setState({ uid: user.uid })
    firebase.database().ref('/customers/' + user.uid).on('value', snapshot => {
      var approved = snapshot.val().approved
      if (approved == '0') 
      {
        showMessage({
          message: "Your profile is pending for approval by mirable team.",
          type: "info",
          position: "top",
          autoHide: false,
          style: styles.message
        });
      }
    }
    );
  }

  render() {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundContainer} blurRadius={8}>
        <ImageOverlay
          height={theme.SIZES.BASE * 35}
          overlayColor="black"
          overlayAlpha={0.7}>
          <Block style={styles.message}>
            <FlashMessage position="top" />
          </Block>
          <Block style={styles.bheadin}>
            <Text style={styles.headin}>Book an Appointment</Text>
          </Block>
          <Block flex center style={styles.home}>
            {this.renderServices()}
          </Block>
        </ImageOverlay>
      </ImageBackground>
    );
  }

}

const styles = StyleSheet.create({
  message: {
    position: 'relative',
    zIndex: 5,
    width: width
  },
  bheadin: {
    padding: 5,
    width: width,
    paddingTop: -10,
    marginTop: 10,
    zIndex: 2,
    backgroundColor: 'rgba(84, 79, 79, 0.98)',
    borderWidth: 0,
  },
  headin: {
    textAlign: 'center',
    fontSize: 22,
    color: 'rgb(251, 248, 248)',
    fontWeight: "700",
    padding: 1
  },
  backgroundContainer: {
    width: width,
    height: theme.SIZES.BASE * 35
  },
  home: {
    marginTop: -30,
    width: width,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  services: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
});

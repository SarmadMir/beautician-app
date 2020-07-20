import React from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, ImageBackground, FlatList,YellowBox} from 'react-native';
import { ListItem } from 'react-native-elements';
import { Block, Text, theme } from 'galio-framework';
import bgImage from "../images/background.jpg";
import ImageOverlay from "react-native-image-overlay";
import FlashMessage, { showMessage } from "react-native-flash-message";
import firebase from 'firebase';
import { Icon } from '../components';
import { HeaderHeight } from "../constants/utils";
import ConfirmationModal from "../components/confirmationModal";

const { width, height } = Dimensions.get('screen');

export default class beauticianHome extends React.Component {

  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
      ];
    YellowBox.ignoreWarnings(['Setting a timer']);
    this.state = {
      appointments: [],
      cid: '',
      name: '',
      gender:'',
      email:'',
      pic: '',
      address: '',
      appointment:'',
      mobile_no:'',
      loading: true,
      refreshing:false,
      modalVisible:false
    }
  }

  //Check if the user is approved or not on page load
  componentDidMount() {
    var user = firebase.auth().currentUser;
    this.setState({ uid: user.uid })
    firebase.database().ref('/beauticians/' + user.uid).on('value', snapshot => {
      var approved = snapshot.val().approved
      if (approved == '0') {
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
    this.loadBookings()
  }

  // Load the customers who booked the beautician
  loadBookings() {
    var itemList = [];
    firebase.database().ref('customers').once('value', snapshot => {
      snapshot.forEach(function (childd) {
        childd.child('appointments').forEach(function (child) {
          if (child.key == firebase.auth().currentUser.uid) 
          {
            itemList.push(childd.val())                     //fetch those customers who booked the current beautician
          }
        })
      })
      this.setState({ appointments: itemList,loading:false,refreshing:false })
    })
  }
  // on the data change of the flatlist items refresh the list to view updated stuff
  handleRefresh=()=>{
    this.setState({refreshing:true,modalVisible:false})
    this.loadBookings()
  }

  render() {
    const { loading } = this.state;
    return loading ? (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="rgba(84, 79, 79, 0.98)" />
      </View>
    ) : (
        <ImageBackground source={bgImage} style={styles.backgroundContainer} blurRadius={8}>
          <ImageOverlay
            height={height}
            overlayColor="black"
            overlayAlpha={0.8}>
            <Block style={styles.message}>
              <FlashMessage position="top" />
            </Block>
            <ConfirmationModal
              modalVisible={this.state.modalVisible}
              setModalVisible={vis => {
                this.setState({ modalVisible: vis });
              }}
              id={this.state.cid}
              name={this.state.name}
              gender={this.state.gender}
              email={this.state.email}
              address={this.state.address}
              appointment={this.state.appointment}
              mobile_no={this.state.mobile_no}
              pic={this.state.pic}
            />
            <Block flex style={styles.profile}>
              <FlatList
                data={this.state.appointments}
                refreshing={this.state.refreshing}
                onRefresh={()=>this.handleRefresh()}
                renderItem={({ item }) => (
                  <ListItem
                    roundAvatar
                    activeOpacity={0.2}
                    title={this.renderName(item.username)}
                    subtitle={this.renderSubtitle(item.address, item.role, item.appointments)}
                    leftAvatar={{ size: 100, source: { uri: item.profile_picture } }}
                    containerStyle={styles.list}
                    onPress={() => this.renderConfirmation(
                                              item.uid,
                                              item.username,
                                              item.gender,
                                              item.email,
                                              item.mobile_no,
                                              item.appointments,
                                              item.profile_picture,
                                              item.address
                                              )}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </Block>
          </ImageOverlay>
        </ImageBackground>
      );
  }

  renderConfirmation = (uid,username,gender,email,mobile_no,appointments,profile_picture,address) => {
    this.setState({
      modalVisible:true,
      cid:uid,
      name:username,
      gender:gender,
      email:email,
      mobile_no:mobile_no,
      appointment:appointments,
      pic:profile_picture,
      address:address
    })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: '0%',
          backgroundColor: "rgba(84, 79, 79, 0.98)",
        }}
      />
    )
  }
  renderName = (username) => {
    return (
      <Text style={styles.listName}>
        {username}
      </Text>
    )
  }

  // so what we are doing is that only those appointment timings will be shown whose id matches with list appointment's id 
  renderSubtitle = (address, role, appointments) => {
    return (
      <View>
        <View style={styles.row}>
          <View style={styles.column1}>
            <Text style={styles.listSub2}>
              {role}
            </Text>
          </View>
          <View style={styles.column2}>
            <View>
              {this.renderStatus(appointments)}
            </View>
            <View style={styles.row}>
              <View>
                {this.renderTime(appointments)}
              </View>
              <View>
                {this.renderDate(appointments)}
              </View>
            </View>
            <Text style={styles.listSub3}>
              <Icon name="map-marker" family="font-awesome" color={theme.COLORS.WHITE} size={18} />{` `}{address}
            </Text>
          </View>
        </View>
      </View>
    )
  }


  renderStatus = (appointments) => {
    var uid = firebase.auth().currentUser.uid
    return Object.entries(appointments).map(item => {
      if (item[0] == uid) {
        return Object.values(item[1]).map(item => {
          return (
            <Text key={item} style={styles.listServices}>
              {item.status}
            </Text>
          )
        })
      }
    })
  }

  renderTime = (appointments) => {
    var uid = firebase.auth().currentUser.uid
    return Object.entries(appointments).map(item => {
      if (item[0] == uid) {
        return Object.values(item[1]).map(item => {
          return (
            <Text key={item} style={styles.listServices}>
              {item.time}{` `}|{` `}
            </Text>
          )
        })
      }
    })
  }

  renderDate = (appointments) => {
    var uid = firebase.auth().currentUser.uid

    return Object.entries(appointments).map(item => {
      if (item[0] == uid) {
        return Object.values(item[1]).map(item => {
          return (
            <Text key={item} style={styles.listServices}>
              {item.date}
            </Text>
          )
        })
      }
    })

  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
    // paddingVertical: theme.SIZES.BASE * 5,
  },
  message: {
    position: 'relative',
    zIndex: 20,
    width: width
  },
  bookings: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
  listServices: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgb(251, 248, 248)",
    paddingBottom: 5,
  },
  list: {
    width: width,
    borderBottomWidth: 0,
    borderTopWidth: 1,
    borderRadius: 15,
    backgroundColor: "rgba(88, 74, 74, 0.9)",
  },
  backgroundContainer: {
    width: width,
    height: height
  },
  listName: {
    fontSize: 20,
    fontWeight: "600",
    color: "rgb(251, 248, 248)",
    paddingBottom: 2,
    paddingTop: 5
  },
  row: {
    flexDirection: 'row',
  },
  column1: {
    flexDirection: 'column',
  },
  column2: {
    flexDirection: 'column',
    paddingLeft: '25%',
    marginTop: -20
  },
  listSub1: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgb(19, 235, 206)",
  },
  listSub2: {
    fontSize: 15,
    fontWeight: "600",
    color: "#B5B9BC",
    paddingBottom: 4,
  },
  listSub3: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgb(225, 238, 236)",
    paddingTop: 2,
    marginLeft: -20,
    textAlign: 'left'
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});

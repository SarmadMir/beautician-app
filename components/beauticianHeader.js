import React from 'react';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Input, Text, theme } from 'galio-framework';

import Icon from './Icon';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

class bHeader extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }

  renderRight = () => {
    const {  navigation } = this.props;
  }


  renderTabs = () => {
    const {tabTitleLeft} = this.props;
    return (
      <Block row middle style={styles.tabs}>
          <Block row middle>
            <Icon name="bookmark" family="feather" style={{ paddingRight: 8 }} />
            <Text size={18} style={styles.tabTitle}>{tabTitleLeft || 'Appointments'}</Text>
          </Block>
      </Block>
    )
  }

  renderHeader = () => {
    const { tabs } = this.props;
    if (tabs) {
      return (
        <Block center>
          {tabs ? this.renderTabs() : null}
        </Block>
      )
    }
    return null;
  }

  render() {
    const { back, title, white, transparent, navigation } = this.props;
    const { routeName } = navigation.state;
    const noShadow = ["Appointments", "Profile"].includes(routeName);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    return (
      <Block style={headerStyles}>
        <NavBar
          back={back}
          title={title}
          style={styles.navbar}
          transparent={transparent}
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ flex: 0.3, paddingTop: 2  }}
          leftIconName="navicon"
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            {color: theme.COLORS[white ? 'WHITE' : 'ICON']},
          ]}
          onLeftPress={this.handleLeftPress}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

export default withNavigation(bHeader);

const styles = StyleSheet.create({
  title: {
    width: '100%',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  bheader: {
    backgroundColor: theme.COLORS.WHITE,
  },
  tabs: {
    width: width ,
    borderTopWidth:1,
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    marginBottom: 24,
    marginTop: 10,
    elevation: 3,
    paddingTop:15,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
})
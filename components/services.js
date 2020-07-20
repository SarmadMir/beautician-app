import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');

class services extends React.Component {

  render() {
    const { navigation, services, horizontal, style, imageStyle } = this.props;
    const imageStyles = [styles.horizontalImage, imageStyle];
    const subservice = services.title;

    return (
      <Block row={horizontal} card flex style={[styles.services, styles.shadow, style]}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('category',{subservice:subservice})}>
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            <Image source={{ uri: services.image }} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('category',{subservice:subservice})}>
          <Block flex space="between" style={styles.servicesDescription}>
            <Text size={18} style={styles.servicesTitle}>{services.title}</Text>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

export default withNavigation(services);

const styles = StyleSheet.create({
  services: {
    backgroundColor: 'rgba(84, 79, 79, 0.98)',
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 100,
    borderRadius:10,
  },
  servicesTitle: {
    flex: 1,
    flexWrap: 'wrap',
    padding: 6,
    paddingTop:25,
    color:'rgb(251, 248, 248)',
    fontWeight:"700"

  },
  servicesDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  horizontalImage: {
    height: 100,
    width: 'auto',
    borderRadius:15
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});
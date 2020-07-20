import React from 'react';
import { StyleSheet, Dimensions, ScrollView, ImageBackground } from 'react-native';
import ImageOverlay from "react-native-image-overlay";
import { Button, Block, Text, Input, theme } from 'galio-framework';
import bgImage from "../images/background.jpg";

import { SubServices } from '../components/';
import subServices from '../constants/subServices';

const { width, height } = Dimensions.get('screen');

export default class category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subservice: ''
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('subservice'),
        };
      };

    render() {
        const subservice = this.props.navigation.state.params.subservice;
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer} blurRadius={8}>
                <ImageOverlay
                    height={height}
                    overlayColor="black"
                    overlayAlpha={0.7}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.services}>
                        {this.renderSubservice(subservice)}
                    </ScrollView>

                </ImageOverlay>
            </ImageBackground>
        );
    }
    renderSubservice = (subservice) => {
        switch (subservice) {
            case 'Hair Care':
                return ( 
                    <Block flex>
                    <SubServices services={subServices[16]} horizontal />
                    <SubServices services={subServices[17]} horizontal />
                    <SubServices services={subServices[18]} horizontal />
                    <SubServices services={subServices[19]} horizontal />
                    <SubServices services={subServices[20]} horizontal />
                    </Block>
                );
            case 'Make Up':
                return (
                    <Block flex>
                    <SubServices services={subServices[0]} horizontal />
                    <SubServices services={subServices[1]} horizontal />
                    <SubServices services={subServices[2]} horizontal />
                    <SubServices services={subServices[3]} horizontal />
                    <SubServices services={subServices[4]} horizontal />
                    <SubServices services={subServices[5]} horizontal />
                    </Block>
                );
            case 'Facial':
                return (
                    <Block flex>
                    <SubServices services={subServices[6]} horizontal />
                    <SubServices services={subServices[7]} horizontal />
                    <SubServices services={subServices[8]} horizontal />
                    <SubServices services={subServices[9]} horizontal />
                    <SubServices services={subServices[10]} horizontal />
                    </Block>
                );
            case 'Threading And Face Wax':
                return (
                    <Block flex>
                    <SubServices services={subServices[11]} horizontal />
                    <SubServices services={subServices[12]} horizontal />
                    <SubServices services={subServices[13]} horizontal />
                    <SubServices services={subServices[14]} horizontal />
                    <SubServices services={subServices[15]} horizontal />
                    </Block>
                );
            case 'Nails':
                return (
                    <Block flex>
                    <SubServices services={subServices[21]} horizontal />
                    <SubServices services={subServices[22]} horizontal />
                    </Block>
                );
            case 'Scrub':
                return (
                    <Block flex>
                    <SubServices services={subServices[23]} horizontal />
                    <SubServices services={subServices[24]} horizontal />
                    <SubServices services={subServices[25]} horizontal />
                    </Block>
                );
            default:
                return null;
        }
    }
}


const styles = StyleSheet.create({
    backgroundContainer: {
        width: width,
        height: height
    },
    services: {
        width: width - theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE,
        paddingBottom: theme.SIZES.BASE * 5
    },
});

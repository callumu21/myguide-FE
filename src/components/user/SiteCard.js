import React, { useState } from 'react';
import { Button, Overlay, Icon, Image, Divider } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';

const SiteCard = ({visible, setVisible, site}) => {

if(!site) return
const {siteId, siteName, siteDescription, siteImage, siteAddress, contactInfo, websiteLink} = site

const toggleOverlay = () => {
  setVisible(!visible);
};

return <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Image source={{uri:siteImage}} style={{height: 200, width: 300}}/>
        <Text style={styles.textPrimary}>{siteName}</Text>
        <Divider />
        <Text>{siteDescription}</Text>
        <Text>{siteAddress}</Text>
        <Text>{contactInfo}</Text>
        <Text style={{color: 'blue'}} onPress={() => Linking.openURL(websiteLink)}>
            Visit Website
        </Text>
        <Button onPress={toggleOverlay}>
        <Icon name='back' type="entypo"/>
        </Button>
    </Overlay>
}

export default SiteCard

const styles = StyleSheet.create({
    button: {
      margin: 10,
    },
    textPrimary: {
      marginVertical: 20,
      textAlign: 'center',
      fontSize: 20,
    },
    textSecondary: {
      marginBottom: 10,
      textAlign: 'center',
      fontSize: 17,
    },
    });
import { ImageBackground, Text, View } from "react-native" 
import { Button, Input } from '@rneui/themed'
import styles from '../stylesheets/home.js'
import React from "react";
import {useState} from 'react'

const input = React.createRef();
const background = { uri: "https://www.countrywalkers.com/content/uploads/2019/04/CW_June_8-14__2016-5614-crop-1638283854-1800x943.jpg" }

const Home = ({navigation: {navigate}}) => {

  const [tourId, setTourId] = useState()

  const getTourById = () => {
    
    if(!tourId || tourId.match(/[^0-9]/g, '') || tourId.length < 6){
      input.current.shake()
    } else {
      navigate('Tour', {tourId})
    }
  }

  return <ImageBackground source={background} resizeMode='cover' style={{height: '100%'}}>
      <View style={styles.container}>
        <Input ref={input} placeholder='Tour ID' maxLength={6} onChangeText={(text) => setTourId(text)} keyboardType='numeric'></Input>
        <Button title="Join Tour" onPress={getTourById} />
        <Button title="My Tours" onPress={() => navigate('MyTours') } style={'flex: 1'}></Button>
      </View>
    </ ImageBackground>

};

export default Home;
import { ImageBackground, View } from "react-native" 
import { Button, Input } from '@rneui/themed'
import styles from '../stylesheets/home.js'
import React from "react";
import {useState} from 'react'

const input = React.createRef();
const background = { uri: "https://www.countrywalkers.com/content/uploads/2019/04/CW_June_8-14__2016-5614-crop-1638283854-1800x943.jpg" }

const Home = ({navigation: {navigate}}) => {

  const [tourId, setTourId] = useState()
  const [errorMessage, setErrorMessage] = useState('')

  const getTourById = () => {
    
    if(!tourId || tourId.match(/[^0-9]/g, '') || tourId.length < 6){
      setErrorMessage('Please enter a 6 digit tour code')
      input.current.shake()
    } else {
      setErrorMessage('')
      navigate('Tour', {tourId})
    }
  }

  return <ImageBackground style={styles.ImageBackground} source={background} resizeMode='cover' blurRadius={0}>
      <View style={styles.container}>
        <Input ref={input} placeholder='Tour ID' maxLength={6} errorMessage={errorMessage} 
          errorStyle={{
            position: `relative`,
            top: -35,
            left: '40%'
            }} 
          onChangeText={(text) => setTourId(text)} keyboardType='numeric'></Input>
        <Button title="Join Tour" onPress={getTourById} />
        <Button title="My Tours" onPress={() => navigate('MyTours')} ></Button>
      </View>
    </ ImageBackground>

};

export default Home;
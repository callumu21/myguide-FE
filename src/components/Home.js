import { Text, View } from "react-native" 
import { Button, Input } from '@rneui/themed'
import styles from '../stylesheets/home.js'
import React from "react";
import {useState} from 'react'

const input = React.createRef();

const Home = ({navigation,}) => {

  const [tourId, setTourId] = useState()

  const getTourById = () => {
    
    if(tourId.match(/[^0-9]/g, '') || tourId.length < 6){
      input.current.shake()
    } else {
      navigation.navigate('JoinTour')
    }
  }

  return <View style={styles.container}>

      <Input ref={input} placeholder='Tour ID' style={styles} maxLength={6} onChangeText={(text) => setTourId(text)}></Input>
      <Button
        title="Join Tour"
        onPress={getTourById}
        style={styles}
      />
      <Button title="My Tours" onPress={() => navigation.navigate('MyTours') } style={'flex: 1'}></Button>
  </View>

};

export default Home;

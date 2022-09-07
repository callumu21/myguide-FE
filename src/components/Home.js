import { Text, View } from "react-native" 
import { Button, Input } from '@rneui/themed'
import styles from '../stylesheets/home.js'
import React from "react";
import {useState} from 'react'
import JoinTour from "./user/JoinTour";
import MyTours from "./tour-organiser/MyTours";

const input = React.createRef();

const Home = ({navigation: {navigate}}) => {

  const [tourId, setTourId] = useState()

  const getTourById = () => {
    
    if(!tourId || tourId.match(/[^0-9]/g, '') || tourId.length < 6){
      input.current.shake()
    } else {
      navigate('Tour', {tourId})
    }
  }

  return <View style={styles.container}>

      <Input ref={input} placeholder='Tour ID' style={styles} maxLength={6} onChangeText={(text) => setTourId(text)}></Input>
      <Button
        title="Join Tour"
        onPress={getTourById}
        style={styles}
      />
      <Button title="My Tours" onPress={() => navigate('MyTours') } style={'flex: 1'}></Button>
  </View>

};

export default Home;

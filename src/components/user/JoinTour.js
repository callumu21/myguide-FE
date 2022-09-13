import {useEffect, useState} from 'react'
import { Text, View } from "react-native";
import { Button, Image, Icon } from "@rneui/themed";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SitesTab from './SitesTab'
import Map from './Map'
import { getTourById } from "../../utils/api";

const Tab = createBottomTabNavigator();

const JoinTour = ({route}) => {
  const tourId = route.params.tourId
  const [hasStarted, setHasStarted] = useState(false)
  const [tour, setTour] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getTour = async () => {
      try {
      const tour = await getTourById(tourId)
      setTour(tour);
      setIsLoading(false)
      } catch (error) {
        setTour(error.msg)
        setIsLoading(false)
      }
    }
    getTour()
  }, [])

  const startTour = () => {
    setHasStarted(true)
  }

  while(isLoading){
    return <>
      <Text>Tour Loading...</Text>
      <Button loading></Button>
    </>
  }

  if(typeof tour === 'string'){
    return <Text>{tour}</Text>
  }
  
  const {tourCode, tourName, tourDescription, tourImage} = tour;

  while(!hasStarted){
    return <View style={{alignItems: 'center', textAlign: 'center'}}>
    <Text style={{fontSize: 50}}>{tourName}</Text>
    <Image source={{uri:tourImage}} style={{height: 200, width: 300}}></Image>
    <Text> Tour code: {tourCode}</Text>
    <Text>{tourDescription}</Text>
    <Button onPress={startTour}>Start Tour</Button>
    </View>
  }

  return  <Tab.Navigator>
    <Tab.Screen 
      name="Tour Map" 
      options = {{
        tabBarIcon: ({ color, size }) => (
        <Icon
          name="route"
          type="font-awesome-5"
          color={color}
          size={size}
        />
      )}}

      children={()=><Map tourData={tour}/>}/>
    <Tab.Screen 
    name="Tour Sites" 
    options={{
      tabBarIcon: ({ color, size }) => (
      <Icon
        name="landmark"
        type="font-awesome-5"
        color={color}
        size={size}
      />)}}
    children={()=><SitesTab tourData={tour}/>} />
  </Tab.Navigator>
};

export default JoinTour;
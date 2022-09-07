import {useEffect, useState} from 'react'
import { Text, View } from "react-native";
import { Button, Image } from "@rneui/themed";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SitesTab from './SitesTab'
import Map from './Map'
import { getTourById } from "../../utils/api";

const Tab = createBottomTabNavigator();

const JoinTour = ({route}) => {
  const tourId = route.params.tourId
  const [hasStarted, setHasStarted] = useState(false)
  const [tour, setTour] = useState({})

  useEffect(() => {
    const getTour = async () => {
      const tour = await getTourById(tourId)
      setTour(tour);
    }
    getTour()
  }, [])

  const startTour = () => {
    setHasStarted(true)
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
    <Tab.Screen name="Tour Map" children={()=><Map tourData={tour} />}/>
    <Tab.Screen name="Tour Sites" component={SitesTab} />
  </Tab.Navigator>
};

export default JoinTour;
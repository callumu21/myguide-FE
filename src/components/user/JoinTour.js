import { Text, View } from "react-native";
import {useEffect, useRef, useState} from 'react'
import Map from './Map'
import { Button } from "@rneui/themed";

const JoinTour = ({route}) => {
  const tourId = route.params.tourId
  const [isLoading, setIsLoading] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const startTourButton = useRef()

  useEffect(() => {

  }, [])


  const startTour = () => {
    setHasStarted(true)
  }

  while(!hasStarted){
    return <View style={{alignItems: 'center'}}> 
    <Text style={{fontSize: 50, textAlign: 'center'}}>Do you want to take tour {tourId}?</Text>
    <Button onPress={startTour}>Start Tour</Button>
    </View>
  }

  return <View> 
  <Map tourId={tourId} isLoading={isLoading} setIsLoading={setIsLoading}/>
</View>
  

};

export default JoinTour;
import styles from '../../stylesheets/join-tour'
import { useState, useEffect } from "react"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { View, Text } from "react-native"
import * as Location from "expo-location"
import { Marker } from "react-native-maps"

const Map = ({tourId}) => {
  const [errorMsg, setErrorMsg] = useState(null)
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied. Please enable location data.")
        return
      }
      let currentPosition = await Location.getCurrentPositionAsync({})
      setLatitude(currentPosition.coords.latitude)
      setLongitude(currentPosition.coords.longitude)
      setIsLoading(false)
    })()
  }, [])
  
  if (errorMsg) return <Text>{erroMsg}</Text>

  while(isLoading){
    return <Text>Joining {tourId}</Text>
  }

  return <>
  <View style={styles.mapContainer}>
    <MapView
      style={styles.map} 
      showsUserLocation
      showsPointsOfInterest={false}
      showsBuildings={false}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
    >
    </MapView>
  </View>
  </>
}

export default Map
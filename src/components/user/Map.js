import styles from '../../stylesheets/join-tour'
import { useState, useEffect } from "react"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { View, Text } from "react-native"
import * as Location from "expo-location"
import { Marker } from "react-native-maps"
import { getSitesByTour } from '../../utils/api'

const Map = ({tourData}) => {
  const [errorMsg, setErrorMsg] = useState(null)
  // const [latitude, setLatitude] = useState(0)
  // const [longitude, setLongitude] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [tourMarkers, setTourMarkers] = useState()

  useEffect(() => {
    const setUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied. Please enable location data.")
        return
      }
    //   let currentPosition = await Location.getCurrentPositionAsync({})
    //   setLatitude(currentPosition.coords.latitude)
    //   setLongitude(currentPosition.coords.longitude)
      populateTourMarkers()
    }

    const populateTourMarkers = async () => {
      const tourSites = await getSitesByTour(tourData.tourSites);
      setTourMarkers(tourSites)
      setIsLoading(false)
    }

    setUserLocation()
  }, [])
  
  if (errorMsg) return <Text>{errorMsg}</Text>

  while(isLoading){
    return <Text>Joining {tourData.tourName}</Text>
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
        latitude: tourMarkers[0].latitude,
        longitude: tourMarkers[0].longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
    >
    {tourMarkers.map(({siteId, siteName, siteDescription, latitude, longitude}) => {
      return <Marker 
        key={siteId}
        coordinate={{latitude, longitude}}
        title={siteName}
        description={siteDescription}
      />
    })}
    </MapView>
  </View>
  </>
}

export default Map
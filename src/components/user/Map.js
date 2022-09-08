import styles from '../../stylesheets/join-tour'
import { useState, useEffect } from "react"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { View, Text } from "react-native"
import * as Location from "expo-location"
import { Marker } from "react-native-maps"
import { getSitesByTour } from '../../utils/api'
import SiteCard from './SiteCard'

const Map = ({tourData, setUserLatitude, setUserLongitude}) => {
  const [errorMsg, setErrorMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tourMarkers, setTourMarkers] = useState()
  const [site, setSite] = useState()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const setUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied. Please enable location data.")
        return
      }
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

  const getSiteCard = (event) => {
    const siteMarker = event.target._internalFiberInstanceHandleDEV.memoizedProps.site
    setSite(siteMarker)
    setVisible(!visible);
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
    {tourMarkers.map((site) => {
      const {siteId, siteName, siteDescription, latitude, longitude} = site;
      return <Marker 
        key={siteId}
        site={site}
        coordinate={{latitude, longitude}}
        title={siteName}
        description={siteDescription}
        onPress={getSiteCard}
      />
    })}
    </MapView>
    <SiteCard visible={visible} setVisible={setVisible} getSiteCard={getSiteCard} site={site}/>
  </View>
  </>
}

export default Map
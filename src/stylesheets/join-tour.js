import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    mapContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      borderRadius: 4,
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    startTourContainer: {
      alignItems: 'center',
      height: '100%'
    },
    startTourTitle: {
      fontSize: 40,
      textAlign: 'center'
    },
    startTourImage: {
      height: 200, 
      width: 300,
      margin: 10,
      borderRadius: 10
    },
    startTourDescription: {
      textAlign: 'center',
      fontStyle: 'italic',
      margin: 10,
      padding: 10,
    }
})

export default styles
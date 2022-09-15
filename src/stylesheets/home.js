import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "column",
  },
  ImageBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  logo: {
    width: 100,
    height: 40,
    top: 0,
    resizeMode: 'contain',
  },
  loadMessage: {
    textAlign: 'center',
    fontSize: 20
  }
});

export default styles
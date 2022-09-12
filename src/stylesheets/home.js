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

  logoContainer: {
    position: 'absolute',
    right: -Dimensions.get('window').width / 1.7
  },
  logo: {
    width: 100,
    height: 40,
    top: 0,
    resizeMode: 'contain',
  }
});

export default styles
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
  }
});

export default styles
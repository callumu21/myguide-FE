import { Text, LinearProgress } from "@rneui/themed"
import { View } from "react-native"
import styles from "../stylesheets/join-tour"

const Loading = ({loadMessage}) => {
    return <View>
        <Text style={styles.loadMessage}>{loadMessage}</Text>
        <LinearProgress
      variant="indeterminate"
      style={{ width: "90%", alignSelf: 'center', height: 8}}
      color="rgb(247, 167, 108)"
    />  
    </View>
}

export default Loading
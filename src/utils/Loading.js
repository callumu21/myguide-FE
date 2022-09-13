import { Text } from "@rneui/themed"
import { View } from "react-native"

const Loading = ({loadMessage}) => {
    return <View>
        <Text>{loadMessage}</Text>
    </View>
}

export default Loading
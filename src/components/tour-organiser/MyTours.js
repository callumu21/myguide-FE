import { View, Button } from "react-native"
import { Text } from "@rneui/themed";
import { Link } from "@react-navigation/native";
import Sites from "./sites/Sites";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tours from "./Tours";


const Tab = createBottomTabNavigator();

const MyTours = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Sites" component={Sites} />
        <Tab.Screen name="Tours" component={Tours} />
      </Tab.Navigator>
    );
};

export default MyTours;

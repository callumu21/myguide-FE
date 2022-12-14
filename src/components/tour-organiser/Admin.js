import { View, Button } from "react-native";
import { Text, Icon } from "@rneui/themed";
import { Link } from "@react-navigation/native";
import Sites from "./sites/Sites";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tours from "./tours/Tours";
import NewSiteForm from "./sites/NewSiteForm";
import NewTourForm from "./tours/NewTourForm";

const Tab = createBottomTabNavigator();

const Admin = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Sites"
        component={Sites}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="landmark"
              type="font-awesome-5"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={"Add New Site"}
        component={NewSiteForm}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name="plus-circle"
              type="font-awesome-5"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Tours"
        component={Tours}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="route"
              type="font-awesome-5"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name={"Add New Tour"}
        component={NewTourForm}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="plus-circle"
              type="font-awesome-5"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Admin;

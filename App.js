import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentRenderContext, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import JoinTour from './src/components/user/JoinTour';
import MyTours from './src/components/tour-organiser/MyTours'
import Home from './src/components/Home'
import { createTheme, ThemeProvider } from '@rneui/themed';
import theme from './src/stylesheets/theme-provider'

export default function App() {

  const Stack = createNativeStackNavigator();
  return <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="JoinTour" component={JoinTour} />
            <Stack.Screen name="MyTours" component={MyTours} />
          </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </ThemeProvider>
}



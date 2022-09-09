import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentRenderContext, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import JoinTour from './src/components/user/JoinTour';
import MyTours from './src/components/tour-organiser/MyTours'
import Home from './src/components/Home'
import { Button, createTheme, Image, ThemeProvider } from '@rneui/themed';
import theme from './src/stylesheets/theme-provider'
import EditSiteForm from './src/components/tour-organiser/sites/EditSiteForm';
import { View } from 'react-native';

const logo = require('./src/assets/img/logo.png')

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
              headerTitle: () => (
                  <Image source={logo} style={{height: 40, width: 100, resizeMode: 'contain', marginLeft: 110}}/>
              ),
      }}>
          <Stack.Screen name="Home" component={Home} options={{}}/>
          
          <Stack.Screen name="Tour" component={JoinTour} />
          <Stack.Screen name="MyTours" component={MyTours} />
          <Stack.Screen name="EditSiteForm" component={EditSiteForm} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


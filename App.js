import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentRenderContext, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import JoinTour from './src/components/user/JoinTour';
import Home from './src/components/Home'
import { Button, createTheme, Image, ThemeProvider } from '@rneui/themed';
import theme from './src/stylesheets/theme-provider'
import EditSiteForm from './src/components/tour-organiser/sites/EditSiteForm';
import { View } from 'react-native';
import styles from './src/stylesheets/home';
import Admin from './src/components/tour-organiser/Admin';
import EditTourForm from './src/components/tour-organiser/tours/EditTourForm';

const logo = require('./src/assets/img/logo.png')

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
              headerTitle: () => (
                <View>
                  <Image source={logo} style={styles.logo}/>
                </View>
              ),
              headerTitleAlign: 'center'
      }}>
          <Stack.Screen name="Home" component={Home} options={{}}/>
          <Stack.Screen name="Tour" component={JoinTour} />
          <Stack.Screen name="Admin" component={Admin} />
          <Stack.Screen name="EditSiteForm" component={EditSiteForm} />
          <Stack.Screen name="EditTourForm" component={EditTourForm} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


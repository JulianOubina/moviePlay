import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Login, UserContext } from '../ui/screens/Login';

import Profile from '../ui/screens/Profile'; 
import Home from './screens/Home';
import EditProfile from './screens/EditProfile';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import SearchScreen from '../ui/screens/Search'; 
import MovieDetailScreen from '../ui/screens/MovieDetail'; 

import { RootStackParamList } from '../navigation/navigator';


const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const init = async () => {};

    init().finally(async () => {
      await SplashScreen.hide();
      console.log("Boot splash hidden");
    });

    const subscriber = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return subscriber;
  }, []);

  return (
    <UserContext.Provider value={currentUser}>
      <NavigationContainer>
        <Stack.Navigator>
          {currentUser ? (
            <Stack.Screen
              name="Home"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetailScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
            options={{ headerShown: false }} 
          />


        </Stack.Navigator>

      </NavigationContainer>
    </UserContext.Provider>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

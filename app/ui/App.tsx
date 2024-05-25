import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { GoogleSignInComponent, UserContext } from './screens/GoogleSignInComponent';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import BottomTabNavigator from './components/BottomTabNavigator';

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
};

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
        <Stack.Navigator initialRouteName="SignIn">
          {/* Pantalla de inicio de sesión */}
          {!currentUser ? (
            <Stack.Screen
              name="SignIn"
              component={GoogleSignInComponent}
              options={{ headerShown: false }}
            />
          ) : (
            // Pantalla Home con BottomTabNavigator embebido
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {() => (
                <BottomTabNavigator /> 
              )}
            </Stack.Screen>
          )}
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

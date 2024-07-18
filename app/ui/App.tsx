import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, ActivityIndicator, Image } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Login, UserContext } from '../ui/screens/Login';
import Profile from '../ui/screens/Profile'; 
import EditProfile from './screens/EditProfile';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import SearchScreen from '../ui/screens/Search'; 
import MovieDetailScreen from '../ui/screens/MovieDetail'; 
import Trailer from '../ui/screens/Trailer';
import { RootStackParamList } from '../navigation/navigator';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

const Stack = createStackNavigator<RootStackParamList>();

const LockScreenModal = ({ visible }: { visible: boolean }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
  >
    <View style={styles.lockScreen}>
      <Text style={styles.lockScreenText}>No internet connection</Text>
      <ActivityIndicator size="large" color="#E74C3C" />
        <Image
          source={require('../assets/images/noConnectionRobot.png')}
          style={styles.noConnectionImage}
          />
    </View>
  </Modal>
);

const App = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const init = async () => {};

    init().finally(async () => {
      await SplashScreen.hide();
      console.log("Boot splash hidden");
    });
    
    const subscriber = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });
    
    return () => {
      subscriber;
      unsubscribe();
    }    
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
          <Stack.Screen
            name="Trailer"
            component={Trailer}
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
      <LockScreenModal visible={!isConnected} />
    </UserContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)', 
  },
  lockScreenText: {
    color: 'white', 
    fontSize: 20, 
    marginBottom: 20,
  },
  noConnectionImage: {
    width: 75,
    height: 75,
    marginTop: 20,
    marginBottom: 20,
    objectFit: 'contain',
  },
});

export default App;

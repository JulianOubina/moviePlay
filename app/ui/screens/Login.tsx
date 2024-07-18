import React, { useState, useContext, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId: '83888971190-er9vlfe5u4t76rjlir4u15lacfj4v4r1.apps.googleusercontent.com',
});

export const UserContext = React.createContext<FirebaseAuthTypes.User | null>(null);

export const Login = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLogged, setisLogged] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleGoogleSignin = async () => {
    try {
      setisLogged(false);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setJwt(token);

        try {
          const response = await axios.post('https://dai-movieapp-api.onrender.com/auth', {}, {
            headers: {
              'Content-Type': 'application/json',
              'googleId': token,
            }
          });

          if (response.status === 200) {
            const { sessionToken, refreshToken } = response.data;
            
            await AsyncStorage.setItem('sessionToken', sessionToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);

            console.log('Backend response:', response.data);

            setUser(firebaseUser);
            navigation.navigate('Home');
          } else {
            console.log('Error al autenticar con el backend:', response.statusText);
          }
        } catch (error) {
          console.error('Error al autenticar con el backend:', error);
        }
      }
    } catch (error) {
      console.log("Error detectado en el sign in: ", error);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/background.png')} style={styles.background}>
      <UserContext.Provider value={user}>
        <View style={styles.container}>
          <Image source={require('../../assets/images/moviePlay.png')} style={styles.logo} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignin}
              disabled={user != null}
            >
              <Image
                source={require('../../assets/images/google_logo.png')}
                style={styles.googleLogo}
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </UserContext.Provider>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
    position: 'absolute',
    top: 50,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  googleLogo: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 70,
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
});

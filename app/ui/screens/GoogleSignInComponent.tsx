import React, { useState, useContext } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Button, ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App'; 

GoogleSignin.configure({
  webClientId: '83888971190-er9vlfe5u4t76rjlir4u15lacfj4v4r1.apps.googleusercontent.com',
});

export const UserContext = React.createContext<FirebaseAuthTypes.User | null>(null);

export const GoogleSignInComponent = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); 

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn(); 
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      setUser(auth().currentUser);
      navigation.navigate('Home'); 
    } catch (error) {
      console.log("Error detectado en el sign in: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      setUser(null);
      console.log("User Logged Out");
    } catch (error) {
      console.log("Error detectado en el sign out: ", error);
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
            {user && (
              <Button title="Sign Out" onPress={handleSignOut} color="#DB4437" />
            )}
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

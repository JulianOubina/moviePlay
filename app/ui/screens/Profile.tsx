import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { UserContext } from './Login';

const Profile: React.FC = () => {
  const user = useContext(UserContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();
      Alert.alert('Signed out', 'You have been signed out successfully.');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Sign out failed', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        <Image
          source={require('../../assets/images/profile.png')} 
          style={styles.profilePicture}
        />
      </View>

      <View style={[styles.textContainer, styles.buttonsContainer]}> 
        <Text style={styles.name}>John</Text>
        <View style={styles.underline} />

        <Text style={styles.lastName}>Rubertson</Text>
        <View style={styles.underline} />

        <Text style={styles.username}>JR</Text>
        <View style={styles.underline} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#332222',
    alignItems: 'center',
    padding: 20,
  },
  profilePictureContainer: {
    marginTop: 40,
    marginBottom: 50,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#FF4B3A',
  },
  textContainer: {
    backgroundColor: '#505050', 
    padding: 10,
    borderRadius: 30,
    marginBottom: 60,
    width: '100%', 
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    color: '#CCC8C8',
    marginRight: 5,
  },
  lastName: {
    fontSize: 20,
    color: '#CCC8C8',
  },
  username: {
    fontSize: 20,
    color: '#CCC8C8',
  },
  buttonsContainer: { 
    width: '100%',
  },
  button: {
    backgroundColor: '#FF4B3A',
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  underline: { 
    width: '80%',
    height: 0.9, 
    backgroundColor: '#CCC8C8',
    marginBottom: 20,
  },
});

export default Profile;

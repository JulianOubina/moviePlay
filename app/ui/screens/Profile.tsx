import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import { UserContext } from './Login';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile: React.FC = () => {
  const user = useContext(UserContext);
  console.log(user)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [nick, setNick] = useState();
  const [profileImage, setProfileImage] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      
      if (!sessionToken) {
        throw new Error('Session token not found');
      }

      const currentUser = auth().currentUser;
  
      const response = await axios.get('https://dai-movieapp-api.onrender.com/users/me', {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          googleId: user?.uid
        }
      });
  
      console.log('User Data:', response.data);
      
      const [firstNameSeparator, ...lastNameParts] = response.data.fullName.split(' ');
      
      
      setFirstName(firstNameSeparator);
      setLastName(lastNameParts.join(' '));
      setNick(response.data.nick);
      setProfileImage(response.data.image);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }    
  };

  const handleSignOut = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
      
      if (token && user?.uid) {
        await axios.delete('https://dai-movieapp-api.onrender.com/auth', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'googleId': user.uid,
          }
        });
      }

      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();

      await AsyncStorage.removeItem('sessionToken');
      await AsyncStorage.removeItem('refreshToken');

      Alert.alert('Signed out', 'You have been signed out successfully.');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Sign out failed', 'Failed to sign out. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');

      if (token && user?.uid) {
        
        await axios.delete('https://dai-movieapp-api.onrender.com/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'googleId': user.uid,
          }
        });
      }

      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();

      await AsyncStorage.removeItem('sessionToken');
      await AsyncStorage.removeItem('refreshToken');

      Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
      navigation.navigate('Login');
    } catch (error:any) {
      switch(error.response.status){
        case 403:
          console.error("JWT VENCIDO");
          await getNewTokens();
          handleDeleteAccount();
          break;
        default:
          console.log(error);
          break;
      }
    }
    
  };
  
  const getNewTokens = async () => {
    const refresh = await AsyncStorage.getItem('refreshToken');
    const session = await AsyncStorage.getItem('sessionToken');
    console.log(refresh, session)
    try {
        const response = await axios.put('https://dai-movieapp-api.onrender.com/auth', {}, {
            headers: {
                'sessionToken': session,
                'refreshToken': refresh
            },
        });

        console.log(response.data);

        await AsyncStorage.setItem('sessionToken', response.data.sessionToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        return;
    } catch (err:any) {
        console.log("NO SE PUDO OBTENER EL NUEVO TOKEN " + err);
        handleSignOut()
        return;
    }
}


  const handleEditProfile = () => {
    navigation.navigate('EditProfile', {
      userFirstName:firstName?firstName:"",
      userLastName:lastName?lastName:"",
      userNick:nick?nick:"",
      userImage:profileImage?profileImage:""
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        <Image
          style={styles.profilePicture}
          source={{ uri: "data:image/jpeg;base64,"+profileImage }} 
        />
      </View>

      <View style={[styles.textContainer, styles.buttonsContainer]}>
        <Text style={styles.name}>{firstName}</Text>
        <View style={styles.underline} />

        <Text style={styles.lastName}>{lastName}</Text>
        <View style={styles.underline} />

        <Text style={styles.username}>{nick}</Text>
        <View style={styles.underline} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#332222',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
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

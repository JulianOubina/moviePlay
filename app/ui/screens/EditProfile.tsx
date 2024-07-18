import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { RouteProp, useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import { UserContext } from './Login';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

type EditProfileProp = RouteProp<RootStackParamList, "EditProfile">

type Props = {
  route: EditProfileProp
}

const EditProfile = ({ route }: Props) => {
  const user = useContext(UserContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { userFirstName, userLastName, userNick, userImage } = route.params;
  
  const [firstName, setFirstName] = useState(userFirstName);
  const [lastName, setLastName] = useState(userLastName);
  const [nick, setNick] = useState(userNick);
  const [selectImage, setSelectedImage] = useState(userImage);

  console.log(firstName, lastName, nick);
  
  const handleProfileImage = async () => {
    let options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        if (response.assets && response.assets.length > 0) {
          const selectedAsset = response.assets[0];
          if (selectedAsset.uri) {
            setSelectedImage(selectedAsset.uri);

            try {
              const base64String = await RNFS.readFile(selectedAsset.uri, 'base64');
              setSelectedImage(base64String);
            } catch (error) {
              console.error('Error converting image to base64: ', error);
            }
          }
        }
      }
    });
  };

  const handleUpdateUser = async () => {
    if (!firstName || !lastName || !nick) {
      Alert.alert('Error', 'All fields must be filled out.');
      return;
    }

    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      
      const payload = {
        googleId: user?.uid,
        nick: nick,
        fullName: `${firstName} ${lastName}`,
        email: user?.email,
        image: selectImage
      };
  
      const response = await axios.put('https://dai-movieapp-api.onrender.com/users/me', payload, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        }
      });

      console.log('User Data:', response.data);
      setFirstName('')
      setLastName('')
      setNick('')
      setSelectedImage('')
      handleRollback();
    } catch (error: any) {
      switch (error.response.status) {
        case 403:
          console.error("JWT VENCIDO");
          await getNewTokens();
          handleUpdateUser();
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
    } catch (err: any) {
      console.log("NO SE PUDO OBTENER EL NUEVO TOKEN " + err);
      handleSignOut()
      return;
    }
  }

  const handleSignOut = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');

      if (token && user?.uid) {
        await axios.delete('https:dai-movieapp-api.onrender.com/auth', {
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

  const handleRollback = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'BottomTabNavigator',
        params: {
          screen: 'Profile'
        },
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={handleProfileImage}>
          <Image style={styles.profilePicture} source={{ uri: "data:image/jpeg;base64," + selectImage }} />
        </TouchableOpacity>
      </View>

      <View style={[styles.textContainer, styles.buttonsContainer]}>
        <Text style={styles.name}>First Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFirstName}
          value={firstName}
          placeholder={userFirstName}
        />
        <View style={styles.underline} />

        <Text style={styles.name}>Last Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setLastName}
          value={lastName}
          placeholder={userLastName}
        />
        <View style={styles.underline} />

        <Text style={styles.name}>Nickname</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNick}
          value={nick}
          placeholder={userNick}
        />
        <View style={styles.underline} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRollback}>
          <Text style={styles.buttonText}>Cancel</Text>
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
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#FF4B3A',
  },
  input: {
    height: 15,
    width: '80%',
    margin: 12,
    borderBottomWidth: 0,
    padding: 0,
    borderColor: 'grey'
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  textContainer: {
    backgroundColor: '#505050',
    padding: 10,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    color: '#CCC8C8',
    marginRight: 0,
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
  tabNavigatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
  },
});

export default EditProfile;


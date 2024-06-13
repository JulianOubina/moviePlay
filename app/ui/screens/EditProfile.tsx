import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import { UserContext } from './Login';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EditProfile: React.FC = () => {
  const user = useContext(UserContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const displayName = user?.displayName || '';
  const names = displayName.split(' ');
  
  const [firstName, setFirstName] = useState(names[0]);
  const [lastName, setLastName] = useState(names.slice(1).join(' '));
  const [nick, setNick] = useState(user?.nick || '');
  const [selectImage, setSelectedImage] = useState(user?.image || '');

  const handleProfileImage = async () => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    }

    launchImageLibrary(options, response=>{
      setSelectedImage(response.assets[0].uri)
      console.log(response.assets[0].uri)
    })
  };

  const handleUpdateUser = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      
      const payload = {
        googleId: user?.uid,
        nick: nick,
        fullName: `${firstName} ${lastName}`,
        email: user?.email,
        image: selectImage
      };
  
      const response = await axios.put('https://dai-movieapp-api.onrender.com/users/me', {body: payload}, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        }        
      }, );
  
      // const response = await axios.put('https://dai-movieapp-api.onrender.com/auth', {}, {
      //   headers: {
      //       'sessionToken': session,
      //       'refreshToken': refresh
      //   },
      // });

      console.log('User Data:', response.data);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }    
  };
  
  const handleRollback = () => {
    navigation.navigate('BottomTabNavigator');
  }

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={handleProfileImage}>
          <Image style={styles.profilePicture} source={{ uri: user?.photoURL }} />
        </TouchableOpacity>
      </View>

      <View style={[styles.textContainer, styles.buttonsContainer]}>
        <Text style={styles.name}>First Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFirstName}
          value={firstName}
          placeholder="Enter first name"
        />
        <View style={styles.underline} />

        <Text style={styles.name}>Last Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setLastName}
          value={lastName}
          placeholder="Enter last name"
        />
        <View style={styles.underline} />

        <Text style={styles.name}>Nickname</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNick}
          value={nick}
          placeholder="Enter a nickname"
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
    borderWidth: 2,
    borderColor: '#FF4B3A',
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

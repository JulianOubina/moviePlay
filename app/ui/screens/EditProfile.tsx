import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import { UserContext } from './Login';
import axios from 'axios';

const EditProfile: React.FC = () => {
  const user = useContext(UserContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const displayName = user?.displayName || '';
  const names = displayName.split(' ');
  const [firstName, setFirstName] = useState(names[0]);
  const [lastName, setLastName] = useState(names.slice(1).join(' '));

  const [nick, setNick] = useState(user?.nick || '');

  const handleProfileImage = () => {
    // Implementa la lógica para cambiar la foto de perfil
    console.log("CAMBIAR FOTO");
  }

  const handleUpdateUser = async () => {
    try {
      const url = 'https://dai-movieapp-api.onrender.com/users/me';
      const payload = {
        googleId: user?.uid,
        nick: nick,
        fullName: `${firstName} ${lastName}`,
        email: user?.email || '', 
        image: user?.image
      };
  
      const response = await axios.put(url, payload);
  
      if (response.status === 200) {
        console.log('Usuario actualizado con éxito');
      } else {
        console.error('Hubo un error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };
  
  const handleRollback = () => {
    navigation.navigate('Profile');
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

        <Text style={styles.name}>Nick</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNick}
          value={nick}
          placeholder="Enter nick"
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
    height: 40,
    width: '80%',
    margin: 12,
    borderBottomWidth: 0.25,
    padding: 10,
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
    marginBottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    color: '#CCC8C8',
    marginRight: 5,
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

export default EditProfile;

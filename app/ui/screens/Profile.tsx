import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Profile = () => {
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
        <TouchableOpacity style={styles.button}>
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
      backgroundColor: '#2D1F1F',
      alignItems: 'center',
      padding: 20,
    },
    profilePictureContainer: {
      marginTop: 40,
      marginBottom: 40,
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
      marginBottom: 40,
      width: '100%', 
      alignItems: 'center',
    },
    nameContainer: {
      flexDirection: 'row', 
    },
    divider: {
      width: 1,
      height: 20,
      backgroundColor: '#CCC8C8',
      marginHorizontal: 10, 
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

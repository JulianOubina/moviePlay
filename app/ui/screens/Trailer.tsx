import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Trailer = ({ route }) => {
  const { trailer } = route.params;
  const navigation = useNavigation();
  const handleWatchTrailer = () => {
    console.log(trailer);
    Linking.openURL(trailer);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={25} color="#E74C3C" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.watchButton} onPress={handleWatchTrailer}>
        <Icon name="play-circle-outline" size={100} color="#0096E3" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#332222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  watchButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Trailer;

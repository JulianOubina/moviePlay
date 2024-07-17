import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';

const Trailer = ({ route }) => {
  const { trailer } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={25} color="#E74C3C" />
      </TouchableOpacity>

      <View style={styles.videoPlayer}>
        <YoutubePlayer
          height={300}
          width={300}
          play={true}
          videoId={trailer}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#332222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1, // Asegura que el botón esté por encima del reproductor de video
  },
  videoPlayer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Trailer;

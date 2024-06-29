import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ToastAndroid, ScrollView } from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/navigator'; 
import Share from 'react-native-share';

type MovieDetailRouteProp = RouteProp<RootStackParamList, 'MovieDetail'> & {
  params: {
    movieId: string;
    posterImage: string;
  };
};

type Props = {
  route: MovieDetailRouteProp;
};

type Movie = {
  idMovie: string;
  title: string;
  subtitle: string;
  genres: string[];
  releaseDate: string;
  rating: number;
  adult: boolean;
  images: string[];
  cast: string[];
  sinopsis: string;
  director: string;
  ratingCount: number;
  duration: number;
  trailer: string;
  shareLink: string;
};

const MovieDetailScreen = ({ route }: Props) => {
  const { movieId, posterImage } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('sessionToken');

        const response = await axios.get(`https://dai-movieapp-api.onrender.com/movies/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const getReleaseYear = (date: string) => {
    return new Date(date).getFullYear().toString();
  };

  const handleShare = async () => {
    try {
      if (movie?.shareLink) {
        await Share.open({ url: movie.shareLink });
        showToast('Link copied to clipboard!');
      } else {
        showToast('No share link available.');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No se encontraron detalles para esta película.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={25} color="#E74C3C" />
      </TouchableOpacity>
      <View style={styles.movieContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: posterImage }}
            style={styles.image}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.button}>
                <Icon name="star" size={25} color="#FFD700" />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Rate</Text>
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.button}>
                <Icon name="heart-outline" size={25} color="#FF4B3A" />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Fav</Text>
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.button} onPress={handleShare}>
                <Icon name="share" size={25} color="#0096E3" />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Share</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.subtitle}>{movie.subtitle}</Text>
          <View style={styles.releaseDateContainer}>
            <Text style={styles.releaseDate}>{getReleaseYear(movie.releaseDate)}</Text>
            <Icon name="time-outline" size={15} color="rgba(240, 240, 240, 0.3)" style={styles.timeIcon} />
            <Text style={styles.releaseDate}>{movie.duration} min</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}> {movie.rating} of {movie.ratingCount} views</Text>
          </View>
          <View style={styles.genresContainer}>
            <Text style={styles.genresLabel}>Gender:</Text>
            <Text style={styles.genres}>{movie.genres.join(', ')}</Text>
          </View> 
          <View style={styles.castContainer}>
            <Text style={styles.castLabel}>Cast:</Text>
            <Text style={styles.cast}>{movie.cast.join(', ')}</Text>
          </View>
          <View style={styles.directorContainer}>
            <Text style={styles.directorLabel}>Director:</Text>
            <Text style={styles.director}>{movie.director}</Text>
          </View>
        </View>
      </View>
      <View style={styles.sinopsisContainer}>
        <Text style={styles.sinopsis}>{movie.sinopsis}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
        {movie.images.slice(1).map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.additionalImage} />
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#332222',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#F0F0F0',
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: '50%',
  },
  movieContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    width: '45%',
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F0F0',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(240, 240, 240, 0.3)',
    marginTop: 5,
  },
  releaseDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  releaseDate: {
    fontSize: 15,
    color: 'rgba(240, 240, 240, 0.3)',
    marginRight: 10,
  },
  timeIcon: {
    marginLeft: 10,
    marginRight: 3,
  },
  genresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  genresLabel: {
    fontSize: 15,
    color: 'rgba(240, 240, 240, 0.3)',
  },
  genres: {
    fontSize: 15,
    color: '#F0F0F0',
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  rating: {
    fontSize: 14,
    color: '#F0F0F0',
    marginLeft: 5,
  },
  castContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
  },
  castLabel: {
    fontSize: 15,
    color: 'rgba(240, 240, 240, 0.3)',
  },
  cast: {
    fontSize: 15,
    color: '#F0F0F0',
    marginLeft: 5,
  },
  directorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  directorLabel: {
    fontSize: 15,
    color: 'rgba(240, 240, 240, 0.3)',
  },
  director: {
    fontSize: 15,
    color: '#F0F0F0',
    marginLeft: 5,
  },
  sinopsisContainer: {
    flex: 1,
    marginTop: 180,
  },  
  sinopsis: {
    fontSize: 15,
    color: '#F0F0F0',
    flex: 1,
  },
  imagesScroll: {
    marginTop: 20,
  },
  additionalImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: 'rgba(240, 240, 240, 0.3)',
  },
});

export default MovieDetailScreen;

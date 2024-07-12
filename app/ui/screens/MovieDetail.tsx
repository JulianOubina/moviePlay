import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ToastAndroid, ScrollView, Modal } from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/navigator'; 
import Share from 'react-native-share';
import { UserContext } from './Login';

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
  id: string;
  title: string;
  subtitle: string;
  genres: string[];
  releaseDate: string;
  rating: number;
  images: string[];
  cast: string[];
  sinopsis: string;
  director: string;
  ratingCount: number;
  duration: number;
  trailer: string;
  trailerId: string;
  shareLink: string;
  userFavorite: boolean;
  userRating: number;
};

const MovieDetailScreen = ({ route }: Props) => {
  const user = useContext(UserContext);
  const { movieId, posterImage } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const navigation = useNavigation();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchMovieDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
      const response = await axios.get<Movie>(`https://dai-movieapp-api.onrender.com/movies/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setMovie(response.data);
      setIsFavorite(response.data.userFavorite);
      setSelectedRating(response.data.userRating); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleToggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
      const body = {
        googleId: user?.uid,
        movie: movieId,
      };
  
      let response;
      if (isFavorite) {
        response = await axios.delete(`https://dai-movieapp-api.onrender.com/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: body,
        });
        showToast('Removed from favorites!');
      } else {
        response = await axios.post(
          `https://dai-movieapp-api.onrender.com/favorites`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showToast('Added to favorites!');
      }
  
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
    }
  };

  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmitRating = async () => {
    if (selectedRating) {
      try {
        const token = await AsyncStorage.getItem('sessionToken');
        const body = {
          movie: movieId,
          rating: selectedRating,
          googleId: user?.uid,
        };

        const response = await axios.post(
          `https://dai-movieapp-api.onrender.com/rating`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showToast(`You rated this movie ${selectedRating} stars!`);
        setRatingModalVisible(false);
        fetchMovieDetails();
      } catch (error) {
        console.error('Error submitting rating:', error.message);
      }
    } else {
      showToast('Please select a rating before submitting.');
    }
  };

  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const handleWatchTrailer = () => {
    if (movie?.trailerId) {
      navigation.navigate('Trailer', { trailer: movie.trailerId });
    } else {
      showToast('No trailer available.');
    }
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalVisible(false);
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
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                <TouchableOpacity style={styles.button} onPress={() => setRatingModalVisible(true)}>
                  <Icon name="star" size={25} color="#FFD700" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Rate</Text>
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={handleToggleFavorite}>
                  {isFavorite ? (
                    <Icon name="heart" size={25} color="#FF4B3A" />
                  ) : (
                    <Icon name="heart-outline" size={25} color="#FF4B3A" />
                  )}
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
            <View style={styles.trailerButtonWrapper}>
              <TouchableOpacity style={styles.trailerButton} onPress={handleWatchTrailer}>
                <Icon name="play-circle-outline" size={35} color="#0096E3" />
                <Text style={styles.trailerButtonText}>Watch Trailer</Text>
              </TouchableOpacity>
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
              <Text style={styles.genresLabel}>Genres:</Text>
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
          {movie.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.additionalImage} />
          ))}
        </ScrollView>
      </View>
      
      <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeImageModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeModalButton} onPress={closeImageModal}>
              <Icon name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
            )}
          </View>
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate this movie</Text>
            <View style={styles.ratingOptions}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => handleSelectRating(rating)}
                  style={styles.ratingOption}
                >
                  <Icon
                    name="star"
                    size={40}
                    color={selectedRating >= rating ? '#FFD700' : 'gray'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setRatingModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRating}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#332222',
  },
  videoPlayer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-end',
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 20,
  },
  image: {
    width: 150,
    height: 225,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 15
  },
  buttonWrapper: {
    alignItems: 'center',
    marginRight: 20,
  },
  button: {
    marginBottom: 5,
  },
  buttonText: {
    color: 'rgba(240, 240, 240, 0.7)',
    fontSize: 12,
  },
  trailerButtonWrapper: {
    alignItems: 'center',
    marginTop: 15,
  },
  trailerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailerButtonText: {
    color: 'rgba(240, 240, 240, 0.7)',
    fontSize: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F0F0',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(240, 240, 240, 0.7)',
    marginBottom: 10,
  },
  releaseDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  releaseDate: {
    fontSize: 14,
    color: 'rgba(240, 240, 240, 0.7)',
  },
  timeIcon: {
    marginHorizontal: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 14,
    color: 'rgba(240, 240, 240, 0.7)',
  },
  genresContainer: {
    marginBottom: 10,
  },
  genresLabel: {
    fontSize: 14,
    color: 'rgba(240, 240, 240, 0.7)',
  },
  genres: {
    fontSize: 14,
    color: '#F0F0F0',
  },
  castContainer: {
    marginBottom: 10,
  },
  castLabel: {
    fontSize: 14,
    color: 'rgba(240, 240, 240, 0.7)',
  },
  cast: {
    fontSize: 14,
    color: '#F0F0F0',
  },
  directorContainer: {
    marginBottom: 10,
  },
  directorLabel: {
    fontSize: 14,
    color: 'rgba(240, 240, 240, 0.7)',
  },
  director: {
    fontSize: 14,
    color: '#F0F0F0',
  },
  sinopsisContainer: {
    marginBottom: 30,
  },
  sinopsis: {
    fontSize: 14,
    color: 'rgba(240, 240, 240, 0.7)',
  },
  imagesScroll: {
    marginBottom: 20,
  },
  additionalImage: {
    width: 200,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  ratingOption: {
    padding: 10,
    borderRadius: 5,
  },
  selectedRatingOption: {
    backgroundColor: '#FFD700',
  },
  ratingOptionText: {
    fontSize: 16,
  },
  selectedRatingOptionText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#0096E3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
  closeModalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cancelButton: {
    backgroundColor: '#FF4B3A',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MovieDetailScreen;

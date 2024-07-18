import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './Login';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Modal} from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/NavBar';
import Icon from 'react-native-vector-icons/Ionicons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import ActionButtons from '../components/ActionButtons';


type SearchRouteProp = RouteProp<RootStackParamList, 'Search'>;

type Props = {
  route: SearchRouteProp;
};

type Movie = {
  idMovie: string;
  title: string;
  subtitle: string;
  genres: string[];
  releaseDate: string;
  rating: number;
  adult: boolean;
  images: string;
};

const genres = [
  "Action", "Adventure", "Animation", "Music", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History",
  "Horror", "Comedy", "Mystery", "Romance", "Western",
  "TV Movie", "Thriller", "War", "Science Fiction"
];

const SearchScreen = ({ route }: Props) => {
  const { searchQuery } = route.params;
  const user = useContext(UserContext);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesCopy, setMoviesCopy] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [page, setPage] = useState(1);
  const [isOrdered, setIsOrdered] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const ORDER_BY_DATE:number = 1;
  const ORDER_BY_RATING:number = 2;
  const ORDER_BY_BOTH:number = 3;

  const generateRandomKey = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 15; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setLoading(true);
    setIsOrdered(0);
    fetchMovies(1);
  }, [searchQuery]);

  const fetchMovies = async (pageNumber: any) => {
    if (isOrdered || moviesCopy.length){
      return;
    }
    try {
      const token = await AsyncStorage.getItem('sessionToken');

      const response = await axios.get('https://dai-movieapp-api.onrender.com/movies', {
        params: {
          page: pageNumber,
          searchParam: searchQuery,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      setPage(pageNumber + 1);
      setLoading(false);
    } catch (error: any) {
      switch (error.response.status) {
        case 403:
          await getNewTokens();
          fetchMovies(pageNumber);
          break;
        default:
          console.log(error);
          break;
      }
      setLoading(false);
    }
  };

  const getNewTokens = async () => {
    const refresh = await AsyncStorage.getItem('refreshToken');
    const session = await AsyncStorage.getItem('sessionToken');

    try {
      const response = await axios.put('https://dai-movieapp-api.onrender.com/auth', {}, {
        headers: {
          'sessionToken': session,
          'refreshToken': refresh,
        },
      });

      await AsyncStorage.setItem('sessionToken', response.data.sessionToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      return;
    } catch (err: any) {
      console.log("NO SE PUDO OBTENER EL NUEVO TOKEN " + err);
      handleSignOut();
      return;
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
          },
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

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const sortMoviesByReleaseDate = (movies: Movie[]): Movie[] => {
    return movies.slice().sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  };

  const sortMoviesByRating = (movies: Movie[]): Movie[] => {
    return movies.slice().sort((a, b) => b.rating - a.rating);
  };

  const sortMoviesByBoth = (movies: Movie[]): Movie[] => {
    return movies.slice().sort((a, b) => {
      if (new Date(a.releaseDate).getFullYear() === new Date(b.releaseDate).getFullYear()) {
        return b.rating - a.rating;
      }
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });
  };

  const handleOrderMovies = () => {
    const status = isOrdered === ORDER_BY_BOTH ? ORDER_BY_DATE : isOrdered + 1;
    setIsOrdered(status);
    let movieList: Movie[];
    if(status === ORDER_BY_DATE){
      movieList = sortMoviesByReleaseDate(movies);
    }else if(status === ORDER_BY_RATING){
      movieList = sortMoviesByRating(movies);
    }else if(status === ORDER_BY_BOTH){
      movieList = sortMoviesByBoth(movies);
    }else{
      movieList = movies;
      console.error("Error en el ordenamiento");
    }
    setMovies(movieList);
  }

  const handleFilterMovies = () => {
    // hay que hacer una copia de la peliculas originales para no perderlas
    if(moviesCopy.length === 0){
      setMoviesCopy(movies);
    }
    setIsModalVisible(true);
  }

  const handleGenreSelect = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres([]);
    } else {
      setSelectedGenres([genre]);
    }
  };

  const applyFilters = () => {
    console.log(selectedGenres);
    setMovies(moviesCopy.filter(movie => movie.genres.some(genre => selectedGenres.includes(genre))));
    setIsModalVisible(false);
  };

  const clearFilters = () => {
    console.log(moviesCopy.map(movie => movie.title));
    
    setMovies(moviesCopy);
    setMoviesCopy([]);
    setIsModalVisible(false);
  }

  const handleFocus = (state:boolean) => {
    setIsFocused(state);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      </View>
    );
  }

  const renderGenreButtons = () => {
    const rows = [];
    for (let i = 0; i < genres.length; i += 3) {
      rows.push(
        <View key={i} style={styles.genreRow}>
          {genres.slice(i, i + 3).map((genre, index) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.genreButton, isSelected && styles.genreButtonSelected]}
                onPress={() => handleGenreSelect(genre)}
              >
                <Text style={[styles.genreButtonText, isSelected && styles.genreButtonTextSelected]}>{genre}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <NavBar searchQueryInput={searchQuery} isFocused={isFocused} setIsFocused={handleFocus}/>
      {!movies.length && !loading ? 
      (<View style={styles.loadingContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={25} color="#E74C3C" />
        </TouchableOpacity>
        <Text style={styles.text}>No movies found for the search</Text>
        <Image
          source={require('../../assets/images/searchNotFoundMarron.png')}
          style={styles.notFoundImage}
          />
        </View>
      ):(
        <>
      <ActionButtons isOrdered={isOrdered} handleOrderMovies={handleOrderMovies} handleFilterMovies={handleFilterMovies} />
      <View style={styles.searchResultsContainer}>
        <FlatList
          data={movies}
          keyExtractor={() => generateRandomKey()}
          renderItem={({ item }) => {
            const releaseYear = new Date(item.releaseDate).getFullYear();
            const genres = item.genres.join(' - ');

            return (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => navigation.navigate('MovieDetail', {
                  movieId: item.idMovie,
                })}
              >
                <Image
                  source={{ uri: item.images }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title} {item.subtitle} ({releaseYear})</Text>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={15} color="#FFD700" />
                    <Text style={styles.rating}> {item.rating} </Text>
                  </View>
                  <Text style={styles.releaseDate}>{genres}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          onEndReached={() => fetchMovies(page)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContentContainer}
        />
        
      </View></>)}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Genre</Text>
            <View style={styles.genreContainer}>
              {renderGenreButtons()}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearButton} onPress={() => clearFilters()}>
                <Text style={styles.submitButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={() => applyFilters()}>
                  <Text style={styles.submitButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#332222',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  submitButton: {
    backgroundColor: '#0096E3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  clearButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  genreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#332222',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  searchResultsContainer: {
    flex: 1,
    padding: 20,
    marginVertical: -17,
    marginHorizontal: -20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomRightRadius: -80,
    borderBottomLeftRadius: -80,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 15,
    backgroundColor: 'black',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  rating: {
    fontSize: 14,
    color: '#ccc',
  },
  releaseDate: {
    fontSize: 14,
    color: '#ccc',
  },
  listContentContainer: {
    paddingBottom: 80,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notFoundImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    objectFit: 'contain',
  },
  backButton: {
    position:'absolute',
    top: 10,
    left: 10,
  },
  modalContainer: {
    marginVertical: 100,
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  genreButton: {
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    backgroundColor: '#ddd',
    margin: 4, 
    borderRadius: 5,
    minWidth: 80, 
    alignItems: 'center',
  },
  genreButtonText: {
    fontSize: 14, 
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  genreButtonSelected: {
    backgroundColor: '#0096E3',
  },
  genreButtonTextSelected: {
    color: '#fff',
  },
});

export default SearchScreen;

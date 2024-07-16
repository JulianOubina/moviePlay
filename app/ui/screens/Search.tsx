import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './Login';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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

const SearchScreen = ({ route }: Props) => {
  const { searchQuery } = route.params;
  const user = useContext(UserContext);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [page, setPage] = useState(1);
  const [isOrdered, setIsOrdered] = useState(0);

  const ORDER_BY_DATE = 1;
  const ORDER_BY_RATING = 2;
  const ORDER_BY_BOTH = 3;

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
    if (isOrdered){
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
      if (new Date(a.releaseDate).getTime() === new Date(b.releaseDate).getTime()) {
        return b.rating - a.rating;
      }
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });
  };

  const handleOrderMovies = () => {
    isOrdered === ORDER_BY_BOTH ? setIsOrdered(ORDER_BY_DATE) : setIsOrdered(isOrdered + 1);
    
    switch (isOrdered) {
      case ORDER_BY_DATE:
        sortMoviesByReleaseDate(movies);
        break;
      case ORDER_BY_RATING:
        sortMoviesByRating(movies);
        break;
      case ORDER_BY_BOTH:
        sortMoviesByBoth(movies);
        break;
      default:
        console.error("Error en el ordenamiento");
        break;
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Cargando...</Text>
      </View>
    );
  }

  if (!movies.length && !loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>No hay películas para la búsqueda</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavBar />
      <ActionButtons isOrdered={isOrdered} handleOrderMovies={handleOrderMovies} />
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
                  posterImage: item.images
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
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#332222',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#332222',
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
});

export default SearchScreen;

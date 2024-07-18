import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './Login';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { getNewTokens } from '../../navigation/RefreshToken';



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

type Props = {
  route: any; 
};

const FavoritesScreen: React.FC<Props> = ({ route }) => {
  const user = useContext(UserContext);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [page, setPage] = useState(1);
  //const updateFavs = route.params.updateFavs

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setMovies([]);
      setLoading(true);
      setPage(1);
      fetchFavorites(1);
      console.log(route);
    });
  
    return unsubscribeFocus;
  }, [navigation]);

  const fetchFavorites = async (pageNumber: any) => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');

      const response = await axios.get('https://dai-movieapp-api.onrender.com/favorites', {
        params: {
          page: pageNumber,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          googleId: user?.uid,
        },
      });

      if (response.data && response.data.results) {
        setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
        setPage(pageNumber + 1);
      } else {
        console.error('No se recibieron datos válidos de la API de favoritos:', response.data);
      }

      setLoading(false);
    } catch (error: any) {
      if (error.response?.status === 403) {
        await getNewTokens();
        fetchFavorites(pageNumber);
      } else {
        console.error(error);
        setLoading(false);
      }
    }
  };

  // const fetchMovieDetails = async (movieId: string, token: string) => {
  //   try {
  //     const response = await axios.get(`https://dai-movieapp-api.onrender.com/movies/${movieId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error fetching details for movie ID ${movieId}:`, error);
  //     throw error;
  //   }
  // };

  

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View>
        <ActivityIndicator size="large" color="#E74C3C" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#E74C3C" />
      </View>
    );
  }

  if (!movies.length) {
    return (
      <View style={styles.loadingContainer}>
      <Text style={styles.text}>You don't have any movies added to favorites yet</Text>
      <Image
          source={require('../../assets/images/NoFavorites.png')}
          style={styles.favsImage}
          />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchResultsContainer}>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.idMovie}
          renderItem={({ item }) => {
            const releaseYear = new Date(item.releaseDate).getFullYear();
            const genres = item.genres.join(' - ');

            return (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => navigation.navigate('MovieDetail', {
                  movieId: item.idMovie
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
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
  favsImage: {
    width: 100,
    height: 100,
    marginTop: 20,
    objectFit: 'contain',
  },
});

export default FavoritesScreen;

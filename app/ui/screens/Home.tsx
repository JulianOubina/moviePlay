import React from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Image, FlatList, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import NavBar from "../components/NavBar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import { UserContext } from './Login';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';
import Carousel from "react-native-snap-carousel";

type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  route: HomeRouteProp;
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

type Carrousel = {
  idMovie: string,
  image: string
};

const genres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History",
  "Horror", "Music", "Mystery", "Romance", "Science Fiction",
  "TV Movie", "Thriller", "War", "Western"
];

const [randomGenre1, randomGenre2, randomGenre3] = genres.sort(() => 0.5 - Math.random()).slice(0, 3);
const { width: screenWidth } = Dimensions.get('window');

function Home() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const user = React.useContext(UserContext);
  
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [moviesGenres2, setMoviesGenres2] = React.useState<Movie[]>([]);
  const [moviesGenres3, setMoviesGenres3] = React.useState<Movie[]>([]);

  const [carrouselPhotos, setCarrouselPhotos] = React.useState<Carrousel[]>([]);

  const [genreTitles, setGenreTitles] = React.useState({ genre1: '', genre2: '', genre3: '' });
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const [page, setPage] = React.useState(1);
  const [pageGenre2, setPageGenre2] = React.useState(1);
  const [pageGenre3, setPageGenre3] = React.useState(1);

  React.useEffect(() => {
    setTimeout(() => {
      fetchCarrousel();
      fetchMoviesGenres1(1);
      fetchMoviesGenres2(1);
      fetchMoviesGenres3(1);
      setLoading(false);
    }, 3000);
  }, []);

  const fetchMoviesGenres1 = async (pageNumber: any) => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
  
      const response = await axios.get('https://dai-movieapp-api.onrender.com/movies', {
        params: {
          page: pageNumber,
          genre: randomGenre1,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      setGenreTitles(prev => ({ ...prev, genre1: randomGenre1 }));
      setLoading(false);
      setPage(pageNumber + 1);
    } catch (error: any) {
      switch (error.response.status) {
        case 403:
          await getNewTokens();
          fetchMoviesGenres1(pageNumber);
          break;
        default:
          console.log(error);
          break;
      }
      setLoading(false);
    }
  };

  const fetchMoviesGenres2 = async (pageNumber: any) => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
  
      const response = await axios.get('https://dai-movieapp-api.onrender.com/movies', {
        params: {
          page: pageNumber,
          genre: randomGenre2,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMoviesGenres2((prevMovies) => [...prevMovies, ...response.data.results]);
      setGenreTitles(prev => ({ ...prev, genre2: randomGenre2 }));
      setLoading(false);
      setPageGenre2(pageNumber + 1);
    } catch (error: any) {
      switch (error.response.status) {
        case 403:
          await getNewTokens();
          fetchMoviesGenres2(pageNumber);
          break;
        default:
          console.log(error);
          break;
      }
      setLoading(false);
    }
  };

  const fetchMoviesGenres3 = async (pageNumber: any) => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
  
      const response = await axios.get('https://dai-movieapp-api.onrender.com/movies', {
        params: {
          page: pageNumber,
          genre: randomGenre3,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMoviesGenres3((prevMovies) => [...prevMovies, ...response.data.results]);
      setGenreTitles(prev => ({ ...prev, genre3: randomGenre3 }));
      setLoading(false);
      setPageGenre3(pageNumber + 1);
    } catch (error: any) {
      switch (error.response.status) {
        case 403:
          await getNewTokens();
          fetchMoviesGenres3(pageNumber);
          break;
        default:
          console.log(error);
          break;
      }
      setLoading(false);
    }
  };

  const fetchCarrousel = async () =>{
    try {
      const token = await AsyncStorage.getItem('sessionToken');
  
      const response = await axios.get('https://dai-movieapp-api.onrender.com/movies/carrousel', {
        params: {},
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setCarrouselPhotos(response.data);
    } catch (error: any) {
      switch (error.response.status) {
        case 403:
          await getNewTokens();
          fetchCarrousel();
          break;
        default:
          console.log(error);
          break;
      }
    }
  }

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

  const handleMoviePress = (movieId:string, posterImage:string) => {
    navigation.navigate('MovieDetail', { movieId: movieId, posterImage: posterImage });
  };

  return (
    <View style={styles.container}>
      <NavBar />
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          <View style={styles.carouselContainer}>
            <FlatList
              data={carrouselPhotos}
              keyExtractor={(item) => item.idMovie}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carrouselSection}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleMoviePress(item.idMovie, item.image)}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                  </View>
                </TouchableOpacity>
              )} />
          </View>
          <View style={styles.flatListSection}>
            <Text style={styles.title}>{genreTitles.genre1}</Text>
            <FlatList
              data={movies}
              keyExtractor={(item) => item.idMovie}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleMoviePress(item.idMovie, item.images)}>
                  <View style={styles.movieContainer}>
                    <Image source={{ uri: item.images }} style={styles.movieImage} />
                  </View>
                </TouchableOpacity>
              )}
              onEndReached={() => {
                fetchMoviesGenres1(page);
              }}
              onEndReachedThreshold={0.5}
            />
          </View>
          <View style={styles.flatListSection}>
            <Text style={styles.title}>{genreTitles.genre2}</Text>
            <FlatList
              data={moviesGenres2}
              keyExtractor={(item) => item.idMovie}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleMoviePress(item.idMovie, item.images)}>
                  <View style={styles.movieContainer}>
                    <Image source={{ uri: item.images }} style={styles.movieImage} />
                  </View>
                </TouchableOpacity>
              )}
              onEndReached={() => {
                fetchMoviesGenres2(pageGenre2);
              }}
              onEndReachedThreshold={0.5}
            />
          </View>
          <View style={styles.flatListSection}>
            <Text style={styles.title}>{genreTitles.genre3}</Text>
            <FlatList
              data={moviesGenres3}
              keyExtractor={(item) => item.idMovie}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleMoviePress(item.idMovie, item.images)}>
                  <View style={styles.movieContainer}>
                    <Image source={{ uri: item.images }} style={styles.movieImage} />
                  </View>
                </TouchableOpacity>
              )}
              onEndReached={() => {
                fetchMoviesGenres3(pageGenre3);
              }}
              onEndReachedThreshold={0.5}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#332222',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
  flatListSection: {
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  movieContainer: {
    marginLeft: 20,
    alignItems: 'center',
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  carouselContainer: {
    height: 250,
    width: '100%',
  },
  carrouselSection: {
    marginHorizontal: 0,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: 250,
    resizeMode: 'cover',
  },
});

export default Home;

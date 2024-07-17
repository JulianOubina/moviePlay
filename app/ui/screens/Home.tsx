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
import GenreScroll from "../components/GenreScroll";

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
const sortedGenres = genres.sort(() => Math.random() - 0.5);

const { width: screenWidth } = Dimensions.get('window');

function Home() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const user = React.useContext(UserContext);
  const [carrouselPhotos, setCarrouselPhotos] = React.useState<Carrousel[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      fetchCarrousel();
      setLoading(false);
    }, 4000);
  }, []);

  
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

  const handleMoviePress = (movieId:string) => {
    navigation.navigate('MovieDetail', { movieId: movieId });
  };

  const handleFocus = (isFocusedParam:boolean) => {
    setIsFocused(isFocusedParam);
  }

  return (
    <View style={styles.container}>
      <NavBar searchQueryInput={''} isFocused={isFocused} setIsFocused={handleFocus} />
      {isFocused && 
        <View style={styles.overlay}>
          <Text>HOLA</Text>
        </View>
      }
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          <View style={styles.carouselContainer}>
            <View style={styles.divider} />
            <FlatList
              data={carrouselPhotos}
              keyExtractor={(item) => item.idMovie}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carrouselSection}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleMoviePress(item.idMovie)}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={styles.divider} />
          </View>
          
          <GenreScroll genreTitle={sortedGenres[0]} handleMoviePress={handleMoviePress} />
          <GenreScroll genreTitle={sortedGenres[1]} handleMoviePress={handleMoviePress} />
          <GenreScroll genreTitle={sortedGenres[2]} handleMoviePress={handleMoviePress} />
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
  divider: {
    height: 2,
    backgroundColor: 'gray',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.3
  }
});

export default Home;

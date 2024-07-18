import React from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Image, FlatList, Dimensions, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import NavBar from "../components/NavBar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import { UserContext } from './Login';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';
import GenreScroll from "../components/GenreScroll";
import Recents from "../components/Recents";
import { getNewTokens } from '../../navigation/RefreshToken';


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
  const [numberRows, setNumberRows] = React.useState(3);

  React.useEffect(() => {
    setTimeout(() => {
      fetchCarrousel();
      setLoading(false);
    }, 5000);
  }, []);

  React.useEffect(() => {

  }, [numberRows])

  
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

  const handleMoviePress = (movieId:string) => {
    navigation.navigate('MovieDetail', { movieId: movieId });
  };

  const handleFocus = (isFocusedParam:boolean) => {
    setIsFocused(isFocusedParam);
    if (!isFocusedParam) {
      Keyboard.dismiss(); 
    }
  }

  const handleScrollEnd = (event: { nativeEvent: { contentOffset: { y: number }, layoutMeasurement: { height: number }, contentSize: { height: number } } }) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isEndReached = contentOffset.y + layoutMeasurement.height >= contentSize.height;
    if (isEndReached) {
      setNumberRows(numberRows + 3);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar searchQueryInput={''} isFocused={isFocused} setIsFocused={handleFocus} />
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#E74C3C" />
      ) : (
        <ScrollView onScrollEndDrag={handleScrollEnd}>
          <View style={styles.carouselContainer}>
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
          </View>            
          {sortedGenres.slice(0, numberRows).map((genre, index) => (
            <GenreScroll key={index} genreTitle={genre} handleMoviePress={handleMoviePress} />
          ))}
        </ScrollView>
      )}
      {isFocused && 
        <Recents handleFocus={handleFocus} />
      }
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
    borderStyle: 'solid',
    borderColor: 'gray',
    borderBottomWidth: 2,
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
    top: 71,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#332222', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;

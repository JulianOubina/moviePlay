import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
  genreTitle: string;
  handleMoviePress: (movieId: string) => void;
};

function GenreScroll({genreTitle, handleMoviePress}: Props) {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [page, setPage] = React.useState<number>(1);

  useEffect(() => {
    fetchMoviesGenres(page);
  }, []);

  const fetchMoviesGenres = async (pageParam: number) => {
    try {
        const token = await AsyncStorage.getItem('sessionToken');
    
        const response = await axios.get('https://dai-movieapp-api.onrender.com/movies', {
          params: {
            page: pageParam,
            genre: genreTitle,
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
        setPage(page + 1);
      } catch (error: any) {
        switch (error.response.status) {
          case 403:
            //await getNewTokens();
            fetchMoviesGenres(pageParam);
            break;
          default:
            console.log(error);
            break;
        }
      }
  };

  return (
    <View style={styles.flatListSection}>
      <Text style={styles.title}>{genreTitle}</Text>
      <FlatList
        data={movies}
        keyExtractor={item => item.idMovie}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleMoviePress(item.idMovie)}>
            <View style={styles.movieContainer}>
              <Image source={{uri: item.images}} style={styles.movieImage} />
            </View>
          </TouchableOpacity>
        )}
        onEndReached={() => {
          fetchMoviesGenres(page);
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
});
export default GenreScroll;

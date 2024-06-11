import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchMovies = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');

      const response = await axios.get('https://dai-movieapp-api.onrender.com/movies', {
        params: {
          page: 1,
          searchParam: searchQuery,
        },
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });

      setMovies(response.data.results); 
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchQuery]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando...</Text>
      </View>
    );
  }

  if (!movies.length && !loading){
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No hay peliculas para la busqueda</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Resultados para: {searchQuery}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.idMovie}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem}
            onPress={() => navigation.navigate('MovieDetail', { movieId: item.idMovie })}
          >
            <Image 
              source={{ uri: item.images }}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Text style={styles.rating}>Rating: {item.rating}</Text>
              <Text style={styles.releaseDate}>Release Date: {item.releaseDate}</Text>
            </View>
          </TouchableOpacity>
        )}
        /* 
        onEndReached={loadMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        */
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default SearchScreen;

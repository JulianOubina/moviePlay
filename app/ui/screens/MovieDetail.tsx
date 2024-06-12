import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/navigator'; 

type MovieDetailRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;

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
  images: string;
};

const MovieDetailScreen = ({ route }: Props) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('sessionToken');

        const response = await axios.get(`https://dai-movieapp-api.onrender.com/movies/${movieId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando...</Text>
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
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.subtitle}>{movie.subtitle}</Text>
      <Text style={styles.genres}>Géneros: {movie.genres.join(', ')}</Text>
      <Text style={styles.releaseDate}>Fecha de lanzamiento: {movie.releaseDate}</Text>
      <Text style={styles.rating}>Rating: {movie.rating}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
  },
  genres: {
    fontSize: 18,
    color: '#666',
  },
  releaseDate: {
    fontSize: 18,
    color: '#666',
  },
  rating: {
    fontSize: 18,
    color: '#666',
  },
});

export default MovieDetailScreen;

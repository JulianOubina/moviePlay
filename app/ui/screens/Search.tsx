import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabNavigator from '../../navigation/BottomTabNavigator';
import NavBar from '../components/NavBar'; 

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
  const [page, setPage] = useState(1);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    fetchMovies();
  }, [searchQuery]);

  const fetchMovies = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');

      const response = await axios.get('https://dai-movieapp-api.onrender.com/movies', {
        params: {
          page: page,
          searchParam: searchQuery,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
      await getNewTokens();
    } catch (error:any) {
      switch(error.response.status){
        case 403:
          console.error("JWT VENCIDO");
          await getNewTokens();
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
    


    console.log(refresh, session)
    
    try{
      // const response = await axios.put('https://dai-movieapp-api.onrender.com/auth', {
      //   params: {
          
      //   },
      //   headers: {
      //     'sessionToken':session,
      //     'refreshToken':refresh
      //   },
      // });
      const response = await axios.put('https://dai-movieapp-api.onrender.com/auth', {}, {
        headers: {
          'sessionToken': session,
          'refreshToken': refresh
        },
      });

      console.log(response.data);
      //console.log(Object.keys(response.statusText));


      await AsyncStorage.setItem('sessionToken', response.data.sessionToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    }catch (err:any){
      console.log("NO SE PUDO OBTENER EL NUEVO TOKEN " + err);
    }
  }

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  };

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
      <View style={styles.searchResultsContainer}>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.idMovie}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => navigation.navigate('MovieDetail', { movieId: item.idMovie })}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.images }}
                  style={styles.image}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <Text style={styles.rating}>Rating: {item.rating}</Text>
                <Text style={styles.releaseDate}>Release Date: {item.releaseDate}</Text>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={fetchMovies}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
      <View style={styles.tabNavigatorContainer}>
        <BottomTabNavigator />
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
  },
  image: {
    width: 100,
    height: 150,
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#FF7A66', 
    borderRadius: 10,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
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
    paddingBottom: 80, // Espacio para el tab navigator
  },
  tabNavigatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
  },
});

export default SearchScreen;

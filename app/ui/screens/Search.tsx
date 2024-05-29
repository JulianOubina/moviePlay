import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App'; // Importa los tipos de navegación

type SearchRouteProp = RouteProp<RootStackParamList, 'Search'>;

type Props = {
  route: SearchRouteProp;
};

const Search = ({ route }: Props) => {
  const { searchQuery } = route.params;

  // Simula una lista de resultados de búsqueda
  const searchResults = [
    { id: '1', name: `Result for "${searchQuery}" 1` },
    { id: '2', name: `Result for "${searchQuery}" 2` },
    { id: '3', name: `Result for "${searchQuery}" 3` },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Buscando: {searchQuery}</Text>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.resultItem}>{item.name}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  resultItem: {
    fontSize: 16,
    color: '#666',
    padding: 10,
  },
});

export default Search;

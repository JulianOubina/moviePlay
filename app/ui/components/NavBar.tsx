import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App'; // Importa los tipos de navegación

const NavBar = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSearchSubmit = () => {
    navigation.navigate('Search', { searchQuery: searchText });
  };

  return (
    <View style={styles.navBarContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={24} color="#E74C3C" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit} // Navegar al presionar Enter
            placeholderTextColor="#95A5A6"
            editable={true} // Asegúrate de que esto sea editable
          />
        </View>
        <TouchableOpacity onPress={handleSearchSubmit} style={styles.filterButton}>
          <Icon name="filter" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    backgroundColor: '#2D1F1F', 
    padding: 15,
    borderRadius: 30, 
    marginHorizontal: -15,
    paddingBottom: -2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    marginHorizontal: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'white',
    fontSize: 16,
  },
  filterButton: {
    padding: 12,
    marginLeft: 10,
  },
  divider: {
    height: 2,
    backgroundColor: 'gray',
    marginTop: 15,
  },
});

export default NavBar;

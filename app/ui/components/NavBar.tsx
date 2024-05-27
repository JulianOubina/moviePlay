import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBar = () => {
  const [searchText, setSearchText] = useState('');

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
            placeholderTextColor="#95A5A6"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      {/* Línea divisoria */}
      <View style={styles.divider} /> 
    </View>
  );
};

const styles = StyleSheet.create({
    navBarContainer: {
      backgroundColor: '#332222', // Color de fondo oscuro
      padding: 15,
      borderRadius: 30, // Bordes redondeados
      marginHorizontal: -15,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'black', // Color de fondo de la barra de búsqueda
      borderRadius: 25, // Bordes redondeados para la barra de búsqueda
      paddingHorizontal: 15, // Espacio horizontal interno
      marginHorizontal: 10,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchIcon: {
      marginRight: 10, // Espacio entre el ícono y el texto
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: 'white', // Color del texto
      fontSize: 16, // Tamaño de fuente del texto
    },
    filterButton: {
      padding: 12,
      marginLeft: 10, // Espacio entre el filtro y la barra de búsqueda
    },
    divider: {
      height: 2,
      backgroundColor: 'gray', // Color similar al fondo, pero ligeramente más oscuro
      marginTop: 15, // Margen superior para separar de la barra de búsqueda
      
    },
  });
  
  export default NavBar;
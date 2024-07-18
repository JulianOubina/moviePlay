import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';

interface NavBarProps {
  searchQueryInput: string;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
}


const NavBar: React.FC<NavBarProps> = ({ searchQueryInput, isFocused, setIsFocused }) => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  //const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const handleSearchSubmit = () => {
    navigation.navigate('Search', { searchQuery: searchText});
  };

  const handleFilter = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleFilterApply = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.navBarContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={24} color="#E74C3C" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={searchQueryInput === '' ? "Search..." : searchQueryInput}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor="#95A5A6"
            editable={true}
          />
        </View>
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
    marginVertical: -2,
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
  orderButton: {
    padding: 12,
    marginLeft: 10,
  },
  divider: {
    height: 2,
    backgroundColor: 'gray',
    marginTop: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterOptions: {
    marginBottom: 20,
    alignItems: 'center',
  },
  filterButtonOption: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 5,
  },
  filterText: {
    color: 'white',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: '#E74C3C',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  overlay:{
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayText:{
    color: '#fff',
    fontSize: 20,
  }
});

export default NavBar;

import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type ActionButtonsProps = {
  handleOrderMovies: () => void;
  handleFilterMovies: () => void;
  isOrdered: number;
};

function ActionButtons({ isOrdered, handleOrderMovies, handleFilterMovies }: ActionButtonsProps) {
  const [icon, setIcon] = React.useState<string>("filter");
  const navigation = useNavigation();
  const ORDER_BY_DATE = 1;
  const ORDER_BY_RATING = 2;
  const ORDER_BY_BOTH = 3;

  useEffect(() => {
    setIcon(getIcon());
  }, [isOrdered]);

  const getIcon = () => {
    switch (isOrdered) {
      case ORDER_BY_DATE:
        return "calendar-outline";
      case ORDER_BY_RATING:
        return "star-outline";
      case ORDER_BY_BOTH:
        return "star-half-outline";
      default:
        return "filter";
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={25} color="#E74C3C" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterButton} onPress={handleFilterMovies}>
        <Icon name="funnel-outline" size={22} color="#E74C3C" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.orderButton} onPress={handleOrderMovies}>
        <Icon name={icon} size={22} color="#E74C3C" />
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: 'gray',
    top: '100%',
  },
  container: {
    height: 35,
    width: '100%', 
  },
  filterButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  orderButton: {
    position: 'absolute',
    top: 10,
    right: 50,
  },
  backButton: {
    alignSelf: 'flex-start',
    top: 10,
    left: 10,
  },
});

export default ActionButtons;

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type ActionButtonsProps = {
  setIsOrdered: (isOrdered: number) => void;
  isOrdered: number;
};

function ActionButtons({ isOrdered, setIsOrdered }: ActionButtonsProps) {
  const ORDER_BY_DATE = 1;
  const ORDER_BY_RATING = 2;
  const ORDER_BY_BOTH = 3;
  
  const toggleOrder = () => {
    if (isOrdered === ORDER_BY_BOTH) {
      setIsOrdered(ORDER_BY_DATE);
    }
    else {
      setIsOrdered(isOrdered + 1);
    }
  };

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
      <TouchableOpacity style={styles.filterButton}>
        <Icon name="funnel-outline" size={22} color="#E74C3C" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.orderButton} onPress={toggleOrder}>
        <Icon name={getIcon()} size={22} color="#E74C3C" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: 'gray',
    top: '100%'
  },
  container: {
    height: 35, // Set the desired height
    width: '100%', // Set the desired width
    //backgroundColor: '#271D1D',
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
});

export default ActionButtons;

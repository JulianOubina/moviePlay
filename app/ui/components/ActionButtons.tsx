import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type ActionButtonsProps = {
  setIsOrdered: React.Dispatch<React.SetStateAction<boolean>>;
};

function ActionButtons({ setIsOrdered }: ActionButtonsProps) {
  const toggleOrder = () => {
    setIsOrdered(true);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterButton}>
        <Icon name="filter" size={22} color="#E74C3C" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.orderButton} onPress={toggleOrder}>
        <Icon name="funnel-outline" size={22} color="#E74C3C" />
      </TouchableOpacity>
      <View style={styles.divider} />
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

import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type ActionButtonsProps = {
  setIsOrdered: React.Dispatch<React.SetStateAction<boolean>>;
};

function ActionButtons({setIsOrdered}: ActionButtonsProps) {
  const toggleOrder = () => {
    setIsOrdered(true);
  };
  return (
    <View>
      <TouchableOpacity style={styles.filterButton}>
        <Icon name="filter" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.orderButton} onPress={toggleOrder}>
        <Icon name="sort" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
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

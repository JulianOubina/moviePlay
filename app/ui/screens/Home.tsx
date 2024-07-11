import React from "react";
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import NavBar from "../components/NavBar";


function Home() {
  const [loading, setLoading] = React.useState<boolean>(true);
  
  React.useEffect(() => {
    setTimeout(() => {
      // fetch data de main
      setLoading(false);
    }, 3000);
  }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <NavBar />
      { 
        loading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#332222',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Home;

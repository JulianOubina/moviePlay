import React from "react";
import { View, StyleSheet } from 'react-native';
import NavBar from "../components/NavBar";

function Home() {
  return (
    <View style={styles.container}>
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#332222',
  },
});

export default Home;

import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Favourites from '../screens/Favourites';
import Profile from '../screens/Profile';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  useEffect(() => {
    Icon.loadFont().then(() => {
      console.log('Ionicons font loaded');
    }).catch(error => {
      console.error('Error loading Ionicons font', error);
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = '';
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Favourites':  
              iconName = 'heart-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
          }
          color = focused ? '#CCC8C8' : '#FF4B3A';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopColor: 'gray', // Color de la línea superior
          borderTopWidth: 1, // Ancho de la línea superior
          backgroundColor: '#2D1F1F',
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favourites" component={Favourites} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../App'; // Ajusta la ruta según tu estructura de carpetas

type MovieDetailRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;

type Props = {
  route: MovieDetailRouteProp;
};
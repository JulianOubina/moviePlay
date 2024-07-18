import React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './navigator';
import { UserContext } from '../ui/screens/Login';


export const getNewTokens = async () => {
    const refresh = await AsyncStorage.getItem('refreshToken');
    const session = await AsyncStorage.getItem('sessionToken');

    try {
        const response = await axios.put('https://dai-movieapp-api.onrender.com/auth', {}, {
        headers: {
            'sessionToken': session,
            'refreshToken': refresh,
        },
        });

        await AsyncStorage.setItem('sessionToken', response.data.sessionToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        return;
    } catch (err: any) {
        console.log("NO SE PUDO OBTENER EL NUEVO TOKEN " + err);
        handleSignOut();
        return;
    }
};

export const handleSignOut = async () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const user = React.useContext(UserContext);
    try {
        const token = await AsyncStorage.getItem('sessionToken');

        if (token && user?.uid) {
        await axios.delete('https://dai-movieapp-api.onrender.com/auth', {
            headers: {
            'Authorization': `Bearer ${token}`,
            'googleId': user.uid,
            },
        });
        }

        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        await auth().signOut();

        await AsyncStorage.removeItem('sessionToken');
        await AsyncStorage.removeItem('refreshToken');

        Alert.alert('Signed out', 'You have been signed out successfully.');
        navigation.navigate('Login');
    } catch (error) {
        console.error(error);
        Alert.alert('Sign out failed', 'Failed to sign out. Please try again.');
    }
};
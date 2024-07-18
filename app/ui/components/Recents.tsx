import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Image, ActivityIndicator} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { UserContext } from "../screens/Login";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNewTokens } from '../../navigation/RefreshToken';

type RecentsProps = {
    handleFocus: (isFocused: boolean) => void;
};

type RecentMovie = {
    idMovie: string;
    title: string;
    subtitle: string;
    genres: string[];
    releaseDate: string;
    rating: number;
    adult: boolean;
    images: string;
};

function Recents({ handleFocus }: RecentsProps) {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [recentMovies, setRecentMovies] = useState<RecentMovie[]>([]);
    const user = React.useContext(UserContext);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    
    useEffect(() => {
        const fetchRecentMovies = async () => {
            try {
                const token = await AsyncStorage.getItem('sessionToken');

                const response = await axios.get(`https://dai-movieapp-api.onrender.com/recents?userId=${user?.uid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setRecentMovies(response.data);
                setLoading(false);
            } catch (error: any) {
                if (error.response?.status === 403) {
                  await getNewTokens();
                  fetchRecentMovies();
                } else {
                  console.error(error);
                  setLoading(false);
                }
              }
        };

        fetchRecentMovies();
    }, []);

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => handleFocus(false)}
            >
                <Icon name="arrow-back" size={25} color="#E74C3C" />
            </TouchableOpacity>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator style={styles.loadingIndicator} size="large" color="#E74C3C" />
                </View>
            ):(<FlatList
                data={recentMovies}
                keyExtractor={(item) => item.idMovie}
                renderItem={({ item }) => {
                    const releaseYear = new Date(item.releaseDate).getFullYear();
                    const genres = item.genres.join(' - ');

                    return (
                        <TouchableOpacity
                            style={styles.resultItem}
                            onPress={() => navigation.navigate('MovieDetail', {
                                movieId: item.idMovie,
                            })}
                        >
                            <Image
                                source={{ uri: item.images }}
                                style={styles.image}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title} {item.subtitle} ({releaseYear})</Text>
                                <View style={styles.ratingContainer}>
                                    <Icon name="star" size={15} color="#FFD700" />
                                    <Text style={styles.rating}> {item.rating} </Text>
                                </View>
                                <Text style={styles.releaseDate}>{genres}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                contentContainerStyle={styles.listContentContainer}
            />)}
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 71,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#332222',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    backButton: {
        position: 'relative',
        top: 10,
        left: 10,
        height: 40,
        width: '100%',
    },
    movieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    movieImage: {
        width: 50,
        height: 75,
        borderRadius: 5,
        marginRight: 10,
    },
    movieTitle: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    resultItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderBottomRightRadius: -80,
        borderBottomLeftRadius: -80,
    },
    image: {
        width: 100,
        height: 150,
        borderRadius: 15,
        backgroundColor: 'black',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    rating: {
        fontSize: 14,
        color: '#ccc',
    },
    releaseDate: {
        fontSize: 14,
        color: '#ccc',
    },
    listContentContainer: {
        paddingBottom: 80,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#332222',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default Recents;

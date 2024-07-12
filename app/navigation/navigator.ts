export const navigator = {
    Login: "Login",
    Home: "Home",
    Profile: "Profile",
    Favourites: "Favourites",
    MovieDetail: "MovieDetail",
    Search: "Search",
    EditProfile: "EditProfile",
    BottomTabNavigator: "BottomTabNavigator",
    Filter: "Filter",
    Trailer: "Trailer"
} as const;

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Profile: undefined;
    Favourites: undefined;
    MovieDetail: { movieId: string, posterImage: string };
    Search: { searchQuery: string, ordered: boolean };
    EditProfile: { userFirstName:string, userLastName:string, userNick:string, userImage:string };
    BottomTabNavigator: undefined;
    Filter: undefined;
    Trailer: { trailer: string};
};


export const navigator = {
    Login: "Login",
    Home: "Home",
    Profile: "Profile",
    Favourites: "Favourites",
    MovieDetail: "MovieDetail",
    Search: "Search",
} as const;

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Profile: undefined;
    Favourites: undefined;
    MovieDetail: { movieId: string };
    Search: { searchQuery: string };
};

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextProps {
  firstName: string;
  lastName: string;
  nick: string;
  profileImage: string;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setNick: (nick: string) => void;
  setProfileImage: (image: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nick, setNick] = useState('');
  const [profileImage, setProfileImage] = useState('');

  return (
    <UserContext.Provider value={{ firstName, lastName, nick, profileImage, setFirstName, setLastName, setNick, setProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

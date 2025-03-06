/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import AuthReducer from './AuthReducer';
import { TimelineActivityType, UserTypes } from '@/helpers/types';

interface AuthState {
  user: any;
  isLoggedIn: boolean;
  token: string;
  allUser: UserTypes[];
  allTimelines: TimelineActivityType[];
}

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  token: string;
  allUser: UserTypes[];
  allTimelines: TimelineActivityType[];
  dispatch: React.Dispatch<any>;
}

const INITITAL_STATE: AuthState = {
  user: null,
  isLoggedIn: false,
  token: '',
  allUser: [],
  allTimelines: [],
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITITAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        token: state.token,
        allUser: state.allUser,
        allTimelines: state.allTimelines,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return context;
};

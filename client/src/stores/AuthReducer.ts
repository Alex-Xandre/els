import { UserTypes } from '@/helpers/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const AuthReducer = (state: any, action: { type: any; payload?: UserTypes & { token: string } }): any => {
  switch (action.type) {
    case 'SIGNING':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
        token: action.payload?.token,
      };
    case 'GET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    case 'GET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SIGNOUT':
      return {
        ...state,
        isLoggedIn: false,
        token: '',
        user: null,
      };
    case 'GET_ALL_USER':
      return {
        ...state,
        allUser: action.payload,
      };

    case 'ADD_USER': {
      const userToAddOrUpdate = action.payload;
      const userIndex = state.allUser.findIndex((user: any) => user._id === userToAddOrUpdate._id);
      if (userIndex >= 0) {
        const updatedUsers = state.allUser.map((user: any, index: number) =>
          index === userIndex ? { ...user, ...userToAddOrUpdate } : user
        );
        return {
          ...state,
          allUser: updatedUsers,
        };
      } else {
        return {
          ...state,
          allUser: [...state.allUser, userToAddOrUpdate],
        };
      }
    }

    default:
      return state;
  }
};

export default AuthReducer;

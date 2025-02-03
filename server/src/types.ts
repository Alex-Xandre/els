import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    _id: string;
    name: string;
    role: string;
  };
}

//address type
export interface AddressTypes {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
}

// personal
export interface PersonalTypes {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthday?: string;
  birthplace?: string;
  address: AddressTypes;
  profile: string;
  age: number;
}

//user types
export interface UserTypes {
  password: string;
  role: 'admin' | 'user';
  userId: string;
  personalData: PersonalTypes;
  email: string;
}

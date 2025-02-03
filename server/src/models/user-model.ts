import { Schema, model } from 'mongoose';
import { UserTypes } from '../types';

const addressSchema = new Schema(
  {
    streetAddress: String,
    city: String,
    state: String,
    zipcode: String,
    latitude: Number,
    permanentAddress: String,
    longitude: Number,
  },
  { _id: false }
);

const personalSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    middleName: { type: String, required: false },
    sex: String,
    civilStatus: String,
    birthday: { type: String, required: false },
    birthplace: { type: String, required: false },
    address: addressSchema,
    contact: String,
    citizenship: String,
    profile: {
      type: String,
      default: 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png',
    },
    age: Number,
  },
  { _id: false }
);

const userSchema = new Schema<UserTypes>(
  {
    password: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    userId: String,
    personalData: personalSchema,
    email: String,
  },
  { timestamps: true }
);
export default model<UserTypes>('User', userSchema);

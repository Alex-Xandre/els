import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middlewares/jwt-functions';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import User from '../models/user-model';
import Session from '../models/session-model';
import { CustomRequest } from '../types';

//register and update
export const registerUser = expressAsyncHandler(async (req, res) => {
  try {
    const data = req.body;
    if (!mongoose.isValidObjectId(data._id)) {
      const { email, password, userId } = data;

      if (!email) {
        res.status(400);
        throw new Error('Please Fill all the Fields');
      }
      const isUserEmail = await User.findOne({ email });
      const isUsername = await User.findOne({ userId: userId });

      if (isUsername || isUserEmail) {
        res.status(400);
        throw new Error('User already existss');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password ? password : data.birthday, salt);
      delete data._id;

      const newUser = await User.create({
        ...data,
        password: hashedPassword,
        userId: userId,
      });

      res.status(200).json({ msg: 'User Added Succesfully', newUser });
    } else {
      const newUser = await User.findByIdAndUpdate(data._id, { ...data, userId: data.userName }, { new: true });
      res.status(200).json({ msg: 'User Updated  Succesfully', newUser });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//login user
export const loginUser = expressAsyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const { userId, password } = data;

    if (!userId || !password) {
      res.status(400);
      throw new Error('Please fill all the fields');
    }

    const user = await User.findOne({ userId });
    if (!user) res.status(400).json({ msg: 'User not Found' });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Invalidate all previous sessions for this user
      await Session.deleteMany({ user: user._id });

      // Generate a new token and session for this login
      const token = generateToken(String(user._id));

      const session = new Session({
        user: user._id,
        sessionToken: token,
      });
      await session.save();

      res.status(200).json({
        role: user.role,
        _id: user._id,
        token,
      });
    } else {
      res.status(500).json({ msg: 'Invalid Email or Password' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//validate session
export const validateSession = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ msg: 'No token provided' });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    const session = await Session.findOne({
      user: decoded.id,
      sessionToken: token,
    });

    if (!session) {
      res.status(401).json({ msg: 'Session expired. Please log in again.' });
      return;
    }

    // If the session is valid
    res.status(200).json({ msg: 'Session is valid' });
  } catch (error: any) {
    res.status(401).json({ msg: error.message || 'Invalid token' });
  }
});

//logout
export const logoutUser = expressAsyncHandler(async (req: any, res) => {
  try {
    // Delete the session from the database (invalidate it)
    await Session.deleteOne({
      user: req.user._id,
      sessionToken: req.headers.authorization.split(' ')[1],
    });

    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getUser = expressAsyncHandler(async (req: CustomRequest, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } else {
    res.status(404).json({ msg: 'User not found' });
  }
});

export const getAllUsers = async (req: CustomRequest, res) => {
  const allUser = await User.find({}).sort({ createdAt: -1 });
  const filterUser = allUser.filter((x) => (x as any)._id.toString() !== req.user._id);
  res.status(200).json(filterUser);
};

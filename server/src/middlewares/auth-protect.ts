import { Request, Response, NextFunction } from 'express';
import User from '../models/user-model';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

interface CustomRequest extends Request {
  user?: {
    _id: any;
  };
}

const protect = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      //verify
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      const user = await User.findById(decoded.id).select('-password');
      req.user = user?.toObject() ?? undefined;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export default protect;

import jwt from 'jsonwebtoken';

//generate token
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

export const activationToken = (payload: any) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN, {
    expiresIn: '2h',
  });
};

export const resetToken = (payload: any) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: '1h',
  });
};

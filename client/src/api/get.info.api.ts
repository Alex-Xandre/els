/* eslint-disable @typescript-eslint/no-explicit-any */

import { handleAxiosError } from '@/config/error-handling';
import USER_API from '@/config/header-api';

export const getUser = async () => {
  try {
    const response = await USER_API.get(`/api/auth/user`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getAllUser = async () => {
  try {
    const response = await USER_API.get(`/api/auth/all-user`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

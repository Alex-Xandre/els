/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINT } from '@/config/API';
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
export const registerUserByAdmin = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/auth/add-user`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

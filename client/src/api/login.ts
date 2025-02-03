/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from '@/config/API';
import { handleAxiosError } from '@/config/error-handling';
import axios from 'axios';

export const loginUser = async (data: any) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/api/auth/login`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const logoutUser = async () => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/api/auth/logoutUser`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

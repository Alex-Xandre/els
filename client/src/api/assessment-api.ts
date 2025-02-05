//assesment-api

import { API_ENDPOINT } from '@/config/API';
import { handleAxiosError } from '@/config/error-handling';
import USER_API from '@/config/header-api';

export const createOrUpdateAssesment = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/assessment`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getAllAssessment = async () => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/assessment`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

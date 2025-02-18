//assesment-api

import { API_ENDPOINT } from '@/config/API';
import { handleAxiosError } from '@/config/error-handling';
import USER_API from '@/config/header-api';
import { AssesmentType, SubmissionType } from '@/helpers/types';

export const createOrUpdateAssesment = async (data: AssesmentType) => {
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

export const createSubmission = async (data: SubmissionType) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/assessment/new-submission`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getSubmisions = async (id: string) => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/assessment/get-submission/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

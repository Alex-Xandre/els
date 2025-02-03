/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from '@/config/API';
import { handleAxiosError } from '@/config/error-handling';
import USER_API from '@/config/header-api';


// Course APIs
export const createOrUpdateCourse = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/courses/courses`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getAllCourses = async () => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/courses/courses`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getCourseDetails = async (id: string) => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/courses/courses/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

// Module APIs
export const createOrUpdateModule = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/courses/modules`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getAllModules = async () => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/courses/modules`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getModuleDetails = async (id: string) => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/courses/modules/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

// Section APIs
export const createOrUpdateSection = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/courses/sections`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getAllSections = async () => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/courses/sections`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getSectionDetails = async (id: string) => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/courses/sections/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

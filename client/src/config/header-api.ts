/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINT } from './API';

const USER_API = axios.create({ baseURL: API_ENDPOINT });

USER_API.interceptors.request.use((req: InternalAxiosRequestConfig<any>) => {
  const storage = sessionStorage.getItem('token');
  if (storage !== null && storage) {
    req.headers.Authorization = `Bearer ${storage}`;
  }
  return req;
});

export default USER_API;

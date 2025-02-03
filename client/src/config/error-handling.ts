/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Helper function for error handling
export const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    };
  } else {
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
};

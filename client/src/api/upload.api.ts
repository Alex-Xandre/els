import USER_API from '@/config/header-api';
import toast from 'react-hot-toast';

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('docs', file);
    const res = await USER_API.post('/api/upload', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total < 1024000) {
          toast.loading('Uploading...');
        }
      },
    });
    toast.dismiss();

    return res.data.url;
  } catch (err: any) {
    
    toast.error(err.response?.data?.msg || 'Upload failed');
    toast.dismiss()
    throw new Error(err.response?.data?.msg || 'Upload failed');
    
  }
};

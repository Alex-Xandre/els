import { uploadFile } from '@/api/upload.api';

export const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string | void> => {
  e.preventDefault();
  const file = e.target.files?.[0];

  if (file) {
    try {
      const uploadedUrl = await uploadFile(file); // Upload the file and get the URL
      return uploadedUrl; // Return the uploaded URL
    } catch (error) {
      console.error('File upload failed:', error);
    }
  }
};

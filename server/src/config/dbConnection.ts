import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

const conn = async (): Promise<void> => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI);
    console.log(response.connection.host);
  } catch (error) {
    console.log(error);
  }
};

export default conn;

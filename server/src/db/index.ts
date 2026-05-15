import mongoose from 'mongoose';

async function connectDB(uri: string) {
  try {
    const conn = await mongoose.connect(uri);
    return conn;
  } catch (error) {
    console.error(`Error in connecting to MongoDB Database`);
  }
}

export default connectDB;

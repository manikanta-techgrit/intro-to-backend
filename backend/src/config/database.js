import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log('Database connected successfully');
    console.log(`Connected to database: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDatabase;
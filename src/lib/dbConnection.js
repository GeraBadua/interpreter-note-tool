import mongoose from 'mongoose';

export const isDemoMode = () => {
  return process.env.DEMO_MODE === 'true' || !process.env.MONGODB_URI;
};

const connectDB = async () => {
  if (isDemoMode()) {
    return { connected: false, demo: true };
  }

  if (mongoose.connection.readyState === 1) {
    return { connected: true, demo: false };
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // No es necesario incluir useNewUrlParser y useUnifiedTopology
    });
    console.log('MongoDB connected');
    return { connected: true, demo: false };
  } catch (err) {
    console.error(err);
    // process.exit(1); // Do not exit the process in a serverless environment
    throw new Error('Database connection failed');
  }
};

export default connectDB;

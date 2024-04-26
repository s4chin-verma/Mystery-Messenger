import mongoose from 'mongoose';

type connectionObject = { isConnected?: number };

const connection: connectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log('Database is already connected');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string, {});
    connection.isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Database connection failed: ', error);
    process.exit(1);
  }
};

export default dbConnect;

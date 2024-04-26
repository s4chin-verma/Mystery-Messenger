import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const messageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, 'Username is Required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  password: { type: String, required: [true, 'Password is Required'] },
  verifyCode: { type: String, required: [true, 'Verify Code is Required'] },
  isVerified: { type: Boolean, default: false },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is Required'],
  },
  isAcceptingMessage: { type: Boolean, required: true, default: true },
  messages: { type: [messageSchema], required: true, default: [] },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', userSchema);

export default UserModel;

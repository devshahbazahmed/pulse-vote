import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      lowercase: true,
      unique: true,
      minLength: 4,
      maxLenght: 122,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      minLength: 4,
      maxLenght: 122,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 4,
      maxLenght: 66,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export const User = mongoose.model('User', userSchema);

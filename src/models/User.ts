import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  userRole: 'admin' | 'patient';
  healthScore: number;
  stepsLogged: number;
  stepsTarget: number;
  waterLogged: number;
  waterTarget: number;
  sleepLogged: number;
  sleepTarget: number;
  weight: number;
  reminders: {
    drinkWater: boolean;
    morningWalk: boolean;
    takeMedicine: boolean;
    sleepEarly: boolean;
  };
  otpCode?: string;
  otpExpiresAt?: Date;
  lastLoginAt?: Date;
  registrationDate: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: { type: String, required: true },
  password: { type: String },
  userRole: { type: String, enum: ['admin', 'patient'], default: 'patient' },
  healthScore: { type: Number, default: 75 },
  stepsLogged: { type: Number, default: 0 },
  stepsTarget: { type: Number, default: 8000 },
  waterLogged: { type: Number, default: 0 },
  waterTarget: { type: Number, default: 8 },
  sleepLogged: { type: Number, default: 0 },
  sleepTarget: { type: Number, default: 8 },
  weight: { type: Number, default: 70 },
  reminders: {
    drinkWater: { type: Boolean, default: true },
    morningWalk: { type: Boolean, default: false },
    takeMedicine: { type: Boolean, default: false },
    sleepEarly: { type: Boolean, default: true }
  },
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
  lastLoginAt: { type: Date },
  registrationDate: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);

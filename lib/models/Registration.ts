import mongoose, { Schema } from 'mongoose';

export interface IRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  parish: string;
  createdAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    id: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    parish: { type: String, default: '' },
    createdAt: { type: String, required: true },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: String },
  },
  { versionKey: false },
);

export const RegistrationModel =
  (mongoose.models.Registration as mongoose.Model<IRegistration>) ||
  mongoose.model<IRegistration>('Registration', RegistrationSchema);

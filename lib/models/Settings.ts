import mongoose, { Schema } from 'mongoose';

export interface ISettings {
  key: string;
  value: number;
}

const SettingsSchema = new Schema<ISettings>({
  key: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
});

export const SettingsModel =
  (mongoose.models.Settings as mongoose.Model<ISettings>) ||
  mongoose.model<ISettings>('Settings', SettingsSchema);

import { connectDB } from './mongoose';
import { RegistrationModel } from './models/Registration';

export type { IRegistration as Registration } from './models/Registration';

function generateId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
    .substring(0, 12);
}

function toPlain(doc: Record<string, unknown>) {
  return {
    id: doc.id as string,
    fullName: doc.fullName as string,
    email: (doc.email as string) ?? '',
    phone: (doc.phone as string) ?? '',
    parish: (doc.parish as string) ?? '',
    createdAt: doc.createdAt as string,
    checkedIn: (doc.checkedIn as boolean) ?? false,
    checkedInAt: doc.checkedInAt as string | undefined,
  };
}

export async function createRegistration(
  data: { fullName: string; email: string; phone: string; parish: string },
): Promise<string> {
  await connectDB();
  const id = generateId();
  await RegistrationModel.create({
    id,
    ...data,
    createdAt: new Date().toISOString(),
    checkedIn: false,
  });
  return id;
}

export async function getRegistration(id: string) {
  await connectDB();
  const doc = await RegistrationModel.findOne({ id }).lean<Record<string, unknown>>();
  return doc ? toPlain(doc) : null;
}

export async function checkInRegistration(id: string): Promise<boolean> {
  await connectDB();
  const result = await RegistrationModel.updateOne(
    { id },
    { $set: { checkedIn: true, checkedInAt: new Date().toISOString() } },
  );
  return result.matchedCount > 0;
}

export async function getAllRegistrations() {
  await connectDB();
  const docs = await RegistrationModel.find().sort({ createdAt: -1 }).lean<Record<string, unknown>[]>();
  return docs.map(toPlain);
}

export async function deleteRegistration(id: string): Promise<boolean> {
  await connectDB();
  const result = await RegistrationModel.deleteOne({ id });
  return result.deletedCount > 0;
}

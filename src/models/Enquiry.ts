import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Replied';
  date: Date;
}

const EnquirySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Replied'], default: 'New' },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

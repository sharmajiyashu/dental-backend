import mongoose, { Schema, Document } from 'mongoose';

export interface ISurvey extends Document {
  name: string;
  age: string;
  gender: string;
  education: string;
  occupation: string;
  answers: {
    brushFrequency: string;
    useToothpaste: string;
    flossFrequency: string;
    useMouthwash: string;
    dentistVisits: string;
    triviaAnswer: string;
  };
  score: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  date: Date;
}

const SurveySchema: Schema = new Schema({
  name: { type: String, default: 'Anonymous' },
  age: { type: String, default: 'N/A' },
  gender: { type: String, default: 'N/A' },
  education: { type: String, default: 'N/A' },
  occupation: { type: String, default: 'N/A' },
  answers: {
    brushFrequency: { type: String, default: 'N/A' },
    useToothpaste: { type: String, default: 'N/A' },
    flossFrequency: { type: String, default: 'N/A' },
    useMouthwash: { type: String, default: 'N/A' },
    dentistVisits: { type: String, default: 'N/A' },
    triviaAnswer: { type: String, default: 'N/A' }
  },
  score: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  wrongCount: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<ISurvey>('Survey', SurveySchema);

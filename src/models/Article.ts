import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  category: 'Oral Health' | 'Nutrition' | 'Fitness' | 'Mental Health';
  readTime: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  steps: string[];
}

const ArticleSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Oral Health', 'Nutrition', 'Fitness', 'Mental Health'], required: true },
  readTime: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String },
  imageUrl: { type: String },
  steps: { type: [String], default: [] }
});

export default mongoose.model<IArticle>('Article', ArticleSchema);

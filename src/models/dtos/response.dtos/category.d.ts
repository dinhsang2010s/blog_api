import { Document } from 'mongoose';

interface ICategory extends Document {
  id: string;
  name: string;
  status: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

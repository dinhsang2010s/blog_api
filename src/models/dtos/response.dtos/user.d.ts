import { Document } from 'mongoose';

interface IUser extends Document {
  id: string;
  name: string;
  password: string;
}

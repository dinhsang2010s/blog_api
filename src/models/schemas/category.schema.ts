import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoryStatus } from 'src/models/enums';

@Schema({ versionKey: false, validateBeforeSave: true, timestamps: true })
export class Category {
  @Prop({ unique: true, index: true, required: true }) name: string;
  @Prop({ default: CategoryStatus.Active }) status: number;
  @Prop() createdBy: string;
  @Prop() updatedBy: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

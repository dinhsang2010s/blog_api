import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, validateBeforeSave: true })
export class Category {
  @Prop({ unique: true, index: true, required: true }) name: string;
  @Prop() status: number;
  @Prop() createdBy: string;
  @Prop() updatedBy: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

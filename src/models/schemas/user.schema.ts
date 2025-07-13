import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ unique: true, index: true }) username: string;
  @Prop({ unique: true, index: true }) email: string;
  @Prop() passwordHash: string;
  @Prop({ default: 'user' }) role: string;
  @Prop() avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

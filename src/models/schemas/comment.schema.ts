import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Comment {
  @Prop({ required: true }) postId: string;
  @Prop({ required: true }) userId: string;
  @Prop({ default: null }) parentCommentId?: string;
  @Prop({ required: true }) content: string;
  @Prop({ min: 1, max: 5 }) rating?: number;
  @Prop({ default: 0 }) likes: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

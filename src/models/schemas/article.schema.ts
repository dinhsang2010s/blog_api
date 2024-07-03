import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Article {
  @Prop({ index: true, required: true }) title: string;
  @Prop() description: string;
  @Prop({ required: true }) content: string;
  @Prop() status: number;
  @Prop({ index: true, required: true }) categoryId: string;
  @Prop({ required: true }) imageTopic: string;
  @Prop({ required: true }) keyWordSeo: string;
  @Prop({ required: true }) descriptionSeo: string;
  @Prop() createdBy: string;
  @Prop() updatedBy: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

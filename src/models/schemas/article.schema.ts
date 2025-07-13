import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ArticleStatus } from 'src/models/enums';

export type ArticleDocument = Article & Document;

@Schema({ versionKey: false, timestamps: true })
export class Article {
  @Prop({ index: true, text: true, required: true }) title: string;
  @Prop({ index: true, unique: true, required: true }) slug: string;
  @Prop({ required: true, maxlength: 60 }) metaTitle: string;
  @Prop({ required: true, maxlength: 155 }) metaDescription: string;
  @Prop({ type: [String], index: true }) keywords: string[];

  // Open Graph SEO
  @Prop() ogTitle: string;
  @Prop() ogDescription: string;
  @Prop() ogImage: string;
  @Prop() ogType: string;

  // Structured Data
  @Prop() structuredData: string; // JSON-LD schema

  @Prop({ required: true }) content: string;
  @Prop() summary: string;

  @Prop({ required: true, index: true }) authorId: string;
  @Prop({ required: true, index: true }) categoryId: string;

  @Prop({ type: [String], index: true }) tags: string[];

  @Prop() coverImage: string;
  @Prop() imageAlt: string;

  @Prop({ type: [String] }) relatedPosts: string[];

  @Prop({ default: 0, index: true }) views: number;
  @Prop({ default: 0 }) likes: number;
  @Prop({ default: 0, min: 0, max: 5 }) averageRating: number;
  @Prop({ default: 0 }) commentCount: number;

  @Prop({ default: ArticleStatus.Draft }) status: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// slug	URL SEO-friendly	Tạo từ tiêu đề, ví dụ: top-5-laptop-2025
// metaTitle	Tiêu đề xuất hiện trên Google	Giới hạn ~60 ký tự
// metaDescription	Mô tả ngắn trong kết quả tìm kiếm	Giới hạn ~155 ký tự
// keywords	Hỗ trợ phân tích nội dung	Có thể dùng để sinh thẻ meta
// tags	Liên kết các bài viết liên quan	Phục vụ liên kết nội bộ (internal linking)
// summary	Mô tả ngắn trong trang listing hoặc mạng xã hội	Có thể dùng làm Open Graph description
// coverImage + imageAlt	SEO hình ảnh	Rất quan trọng khi chia sẻ
// views, likes, ratings	Tăng độ tin tưởng	Có thể dùng làm yếu tố xếp hạng nội bộ
// relatedPosts	Giữ người dùng lâu hơn	Thể hiện bài viết liên quan ở cuối bài

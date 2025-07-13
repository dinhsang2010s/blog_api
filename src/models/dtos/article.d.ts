import { Document } from 'mongoose';

interface IArticle extends Document {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // Open Graph SEO
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;

  // Structured Data
  structuredData?: string;

  content: string;
  summary?: string;

  authorId: string;
  categoryId: string;
  categoryName?: string;

  tags: string[];

  coverImage?: string;
  imageAlt?: string;

  relatedPosts: string[];

  views: number;
  likes: number;
  averageRating: number;
  commentCount: number;

  status: number;
  createdAt: Date;
  updatedAt: Date;
}

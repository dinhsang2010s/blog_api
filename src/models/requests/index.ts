import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRegisterRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @ApiProperty({ type: 'string', description: 'admin' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ type: 'string', description: '123456' })
  password: string;
}

export class UpdateLoginRequest {
  @ApiProperty({ type: 'string', description: 'admin' })
  name: string;
  @ApiProperty({ type: 'string', description: '123456' })
  password: string;
  @ApiProperty({ type: 'boolean', description: 'false', required: false })
  remember?: boolean;
}

export class UpdateQueryRequest {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: '0',
    default: 0,
    required: false,
  })
  offset?: string = '0';

  @IsString()
  @ApiProperty({
    type: 'string',
    description: '10',
    default: 10,
    required: false,
  })
  pageSize?: string = '20';

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'createdAt',
    default: '',
    required: false,
  })
  orderBy?: string = '';

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'a',
    default: '',
    required: false,
  })
  q?: string = '';
}

export class UpdateCategoryRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Tin tức', required: true })
  name: string;

  status: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateArticleRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Toàn bộ thay đổi và thời gian cập nhật của ColorOS 14',
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'toan-bo-thay-doi-va-thoi-gian-cap-nhat-cua-coloros-14',
    required: true,
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  @ApiProperty({
    type: 'string',
    description: 'Toàn bộ thay đổi và thời gian cập nhật của ColorOS 14',
    required: true,
  })
  metaTitle: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  @ApiProperty({
    type: 'string',
    description:
      'OPPO đã phát hành phiên bản beta của ColorOS 14 tới người dùng ở một số khu vực nhất định.',
    required: true,
  })
  metaDescription: string;

  @ApiProperty({
    type: [String],
    description: '["coloros", "oppo", "android"]',
    required: false,
  })
  keywords?: string[];

  // Open Graph SEO
  @ApiProperty({
    type: 'string',
    description: 'Open Graph title',
    required: false,
  })
  ogTitle?: string;

  @ApiProperty({
    type: 'string',
    description: 'Open Graph description',
    required: false,
  })
  ogDescription?: string;

  @ApiProperty({
    type: 'string',
    description: 'Open Graph image URL',
    required: false,
  })
  ogImage?: string;

  @ApiProperty({
    type: 'string',
    description: 'article',
    required: false,
  })
  ogType?: string;

  // Structured Data
  @ApiProperty({
    type: 'string',
    description: 'JSON-LD structured data',
    required: false,
  })
  structuredData?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Nội dung chi tiết của bài viết...',
    required: true,
  })
  content: string;

  @ApiProperty({
    type: 'string',
    description: 'Tóm tắt ngắn gọn của bài viết',
    required: false,
  })
  summary?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Author ID',
    required: true,
  })
  authorId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Category ID',
    required: true,
  })
  categoryId: string;

  @ApiProperty({
    type: [String],
    description: '["technology", "mobile"]',
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    type: 'string',
    description: 'Cover image URL',
    required: false,
  })
  coverImage?: string;

  @ApiProperty({
    type: 'string',
    description: 'Alt text for cover image',
    required: false,
  })
  imageAlt?: string;

  @ApiProperty({
    type: [String],
    description: 'Related post IDs',
    required: false,
  })
  relatedPosts?: string[];

  @ApiProperty({
    type: 'number',
    description: 'View count',
    default: 0,
    required: false,
  })
  views?: number;

  @ApiProperty({
    type: 'number',
    description: 'Like count',
    default: 0,
    required: false,
  })
  likes?: number;

  @ApiProperty({
    type: 'number',
    description: 'Average rating (0-5)',
    default: 0,
    required: false,
  })
  averageRating?: number;

  @ApiProperty({
    type: 'number',
    description: 'Comment count',
    default: 0,
    required: false,
  })
  commentCount?: number;

  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UpdateQueryArticleRequest extends UpdateQueryRequest {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: '123456abc',
    default: '',
    required: false,
  })
  categoryId?: string = '';
}

export class UpdateImageTopicRequest {
  @IsString()
  @IsNotEmpty()
  articleId: string;

  @IsNotEmpty()
  @IsString()
  fileNameUId: string;
}

export class CreateArticleRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Toàn bộ thay đổi và thời gian cập nhật của ColorOS 14',
    required: true,
  })
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'toan-bo-thay-doi-va-thoi-gian-cap-nhat-cua-coloros-14',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    type: 'string',
    description: 'Toàn bộ thay đổi và thời gian cập nhật của ColorOS 14',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    type: 'string',
    description:
      'OPPO đã phát hành phiên bản beta của ColorOS 14 tới người dùng ở một số khu vực nhất định.',
    required: false,
  })
  metaDescription?: string;

  @ApiProperty({
    type: [String],
    description: '["coloros", "oppo", "android"]',
    required: false,
  })
  keywords?: string[];

  // Open Graph SEO
  @ApiProperty({
    type: 'string',
    description: 'Open Graph title',
    required: false,
  })
  ogTitle?: string;

  @ApiProperty({
    type: 'string',
    description: 'Open Graph description',
    required: false,
  })
  ogDescription?: string;

  @ApiProperty({
    type: 'string',
    description: 'Open Graph image URL',
    required: false,
  })
  ogImage?: string;

  @ApiProperty({
    type: 'string',
    description: 'article',
    required: false,
  })
  ogType?: string;

  // Structured Data
  @ApiProperty({
    type: 'string',
    description: 'JSON-LD structured data',
    required: false,
  })
  structuredData?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Nội dung chi tiết của bài viết...',
    required: true,
  })
  content: string;

  @ApiProperty({
    type: 'string',
    description: 'Tóm tắt ngắn gọn của bài viết',
    required: false,
  })
  summary?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Category ID',
    required: true,
  })
  categoryId: string;

  @ApiProperty({
    type: [String],
    description: '["technology", "mobile"]',
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    type: 'string',
    description: 'Cover image URL',
    required: false,
  })
  coverImage?: string;

  @ApiProperty({
    type: 'string',
    description: 'Alt text for cover image',
    required: false,
  })
  imageAlt?: string;

  @ApiProperty({
    type: [String],
    description: 'Related post IDs',
    required: false,
  })
  relatedPosts?: string[];

  @ApiProperty({
    type: 'number',
    description: 'Article status',
    default: 1,
    required: false,
  })
  status?: number;
}

export class UpdateQueryCommentRequest extends UpdateQueryRequest {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'Post ID to filter comments',
    default: '',
    required: false,
  })
  postId?: string = '';

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'User ID to filter comments',
    default: '',
    required: false,
  })
  userId?: string = '';
}

export class CreateCommentRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Post ID',
    required: true,
  })
  postId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Comment content',
    required: true,
  })
  content: string;

  @ApiProperty({
    type: 'string',
    description: 'Parent comment ID for replies',
    required: false,
  })
  parentCommentId?: string;

  @ApiProperty({
    type: 'number',
    description: 'Rating (1-5)',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  rating?: number;
}

export class UpdateCommentRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Comment content',
    required: true,
  })
  content: string;

  @ApiProperty({
    type: 'number',
    description: 'Rating (1-5)',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  rating?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
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

export class LoginDto {
  @ApiProperty({ type: 'string', description: 'admin' })
  name: string;
  @ApiProperty({ type: 'string', description: '123456' })
  password: string;
  @ApiProperty({ type: 'boolean', description: 'false', required: false })
  remember?: boolean;
}

export class QueryPaginationDto {
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

export class CategoryDto {
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

export class ArticleDto {
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
    description:
      'OPPO đã phát hành phiên bản beta của ColorOS 14 tới người dùng ở một số khu vực nhất định.',
    required: false,
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description:
      'Trong phiên bản ColorOS 14, OPPO đã giới thiệu một nền tảng hiệu suất mới tên là Trinity Engine. ',
    required: true,
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'abc123',
    required: true,
  })
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'http://images.logo.com',
    required: false,
  })
  imageTopic: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'toan-bo-tinh-nang-va-thay-doi-co-tren-coloros-14',
    required: false,
  })
  keyWordSeo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Toàn bộ thay đổi và thời gian cập nhật của ColorOS 14',
    required: false,
  })
  descriptionSeo: string;

  status: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class QueryPaginationArticleDto extends QueryPaginationDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: '123456abc',
    default: '',
    required: false,
  })
  categoryId?: string = '';
}

export class ImageTopicDto {
  @IsString()
  @IsNotEmpty()
  articleId: string;

  @IsNotEmpty()
  @IsString()
  fileNameUId: string;
}

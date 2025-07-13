import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { ArticleStatus } from '../../models/enums';
import {
  UpdateArticleRequest,
  UpdateQueryArticleRequest,
  CreateArticleRequest,
} from 'src/models/requests';
import { IUserRequest } from 'src/models/requests/user.request';

@ApiTags('Article')
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get articles with pagination and search' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async getPagination(@Query() query: UpdateQueryArticleRequest) {
    return await this.articleService.getPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  async getById(@Param('id') id: string) {
    return await this.articleService.getContentById(id);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create new article' })
  @ApiResponse({ status: 200, description: 'Article created successfully' })
  async add(
    @Request() req: Request & { user: IUserRequest },
    @Body() model: CreateArticleRequest,
  ) {
    const article = await this.articleService.update('', {
      ...model,
      status: model.status ?? ArticleStatus.Published,
      authorId: req.user.id,
      createdAt: new Date(),
    });

    return article;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  async update(
    @Param('id') id: string,
    @Request() req: Request & { user: IUserRequest },
    @Body() model: UpdateArticleRequest,
  ) {
    const article = await this.articleService.update(id, {
      ...model,
      updatedAt: new Date(),
    });

    return article;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  async delete(@Param('id') id: any) {
    await this.articleService.delete(id);
  }

  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment article view count' })
  @ApiResponse({ status: 200, description: 'View count incremented' })
  async incrementView(@Param('id') id: string) {
    await this.articleService.incrementViews(id);
    return { message: 'View count incremented' };
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment article like count' })
  @ApiResponse({ status: 200, description: 'Like count incremented' })
  async incrementLike(@Param('id') id: string) {
    await this.articleService.incrementLikes(id);
    return { message: 'Like count incremented' };
  }

  @Post(':id/rating')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update article rating' })
  @ApiResponse({ status: 200, description: 'Rating updated' })
  async updateRating(
    @Param('id') id: string,
    @Body() body: { rating: number },
  ) {
    await this.articleService.updateRating(id, body.rating);
    return { message: 'Rating updated' };
  }

  @Post(':id/comment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment article comment count' })
  @ApiResponse({ status: 200, description: 'Comment count incremented' })
  async incrementComment(@Param('id') id: string) {
    await this.articleService.incrementCommentCount(id);
    return { message: 'Comment count incremented' };
  }

  @Get(':id/related')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get related articles' })
  @ApiResponse({ status: 200, description: 'Related articles retrieved' })
  async getRelatedPosts(
    @Param('id') id: string,
    @Query('limit') limit: string = '5',
  ) {
    return await this.articleService.getRelatedPosts(id, parseInt(limit));
  }
}

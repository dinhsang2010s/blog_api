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
import { Public } from 'src/guards/objects';
import { ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import {
  ArticleDto,
  QueryPaginationDto,
} from 'src/models/dtos/request.dtos/request.dtos';
import { Status } from '../../models/enums';
import { UploadService } from '../upload/upload.service';

@ApiTags('Article')
@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private uploadService: UploadService,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getPagination(@Query() query: QueryPaginationDto) {
    return await this.articleService.getPagination(query);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  async add(
    @Request() req: Request & { user: RequestUser },
    @Body() model: ArticleDto,
  ) {
    const article = await this.articleService.update('', {
      ...model,
      status: model.status ?? Status.Running,
      createdBy: req.user.id,
      createdAt: new Date(),
    });

    await this.uploadService.update({
      articleId: article.id,
      fileNameUId: article.imageTopic?.split('/').pop(),
    });

    return article;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Request() req: Request & { user: RequestUser },
    @Body() model: ArticleDto,
  ) {
    const article = await this.articleService.update(id, {
      ...model,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

    await this.uploadService.update({
      articleId: article.id,
      fileNameUId: article.imageTopic?.split('/').pop(),
    });

    return article;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: any) {
    await this.articleService.delete(id);
  }
}

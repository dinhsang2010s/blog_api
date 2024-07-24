import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { Public } from 'src/guards/objects';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import {
  CategoryDto,
  QueryPaginationDto,
} from 'src/models/dtos/request.dtos/request.dtos';
import { Status } from 'src/models/enums';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getPagination(@Query() query: QueryPaginationDto) {
    return await this.categoryService.getPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return await this.categoryService.getById(id);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  async add(
    @Request() req: Request & { user: RequestUser },
    @Body() model: CategoryDto,
  ) {
    return await this.categoryService.update('', {
      ...model,
      status: model.status ?? Status.Running,
      createdBy: req.user.id,
      createdAt: new Date(),
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() model: CategoryDto,
    @Request() req: Request & { user: RequestUser },
  ) {
    return await this.categoryService.update(id, {
      ...model,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.categoryService.delete(id);
  }
}

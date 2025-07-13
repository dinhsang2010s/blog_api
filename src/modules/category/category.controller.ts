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
import { CategoryService } from './category.service';
import { UpdateCategoryRequest, UpdateQueryRequest } from 'src/models/requests';
import { CategoryStatus } from 'src/models/enums';
import { IUserRequest } from 'src/models/requests/user.request';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  @Public()
  @HttpCode(HttpStatus.OK)
  async get() {
    return await this.categoryService.get();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return await this.categoryService.getById(id);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  async add(
    @Request() req: Request & { user: IUserRequest },
    @Body() model: UpdateCategoryRequest,
  ) {
    return await this.categoryService.update('', {
      ...model,
      status: model.status ?? CategoryStatus.Active,
      createdBy: req.user.id,
      createdAt: new Date(),
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() model: UpdateCategoryRequest,
    @Request() req: Request & { user: IUserRequest },
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

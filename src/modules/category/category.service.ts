import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCategoryRequest } from 'src/models/requests';
import { ICategory } from 'src/models/dtos/category';
import { CategoryInterface } from 'src/interfaces/category.interface';
import { Category } from 'src/models/schemas/category.schema';
import { ArticleService } from '../article/article.service';
import { CategoryStatus } from 'src/models/enums';

@Injectable()
export class CategoryService implements CategoryInterface {
  private readonly DEFAULT_ORDER_BY = 'createdAt';
  private readonly DEFAULT_SORT_ORDER = -1;

  constructor(
    @InjectModel(Category.name)
    private readonly categories: Model<ICategory>,
    private readonly articleService: ArticleService,
  ) {}

  async get(q?: string, orderBy?: string): Promise<ICategory[]> {
    const searchQuery = this.buildSearchQuery(q);
    const sortQuery = this.buildSortQuery(orderBy);

    const pipeline: any[] = [
      {
        $match: {
          status: CategoryStatus.Active,
          ...searchQuery,
        },
      },
      {
        $addFields: {
          id: { $toString: '$_id' },
        },
      },
      {
        $sort: sortQuery,
      },
    ];

    return await this.categories.aggregate(pipeline);
  }

  async getById(id: string): Promise<ICategory> {
    return this.categories.findById(id);
  }

  async update(
    categoryId: string,
    updateData: UpdateCategoryRequest,
  ): Promise<ICategory> {
    if (categoryId) {
      return this.updateExistingCategory(categoryId, updateData);
    } else {
      return this.createNewCategory(updateData);
    }
  }

  async delete(catId: string): Promise<void> {
    await this.validateCategoryDeletion(catId);
    await this.categories.deleteOne({ _id: catId });
  }

  private buildSearchQuery(q?: string) {
    if (!q) return {};

    return {
      name: {
        $regex: q,
        $options: 'i',
      },
    };
  }

  private buildSortQuery(orderBy?: string) {
    if (!orderBy) {
      return { [this.DEFAULT_ORDER_BY]: this.DEFAULT_SORT_ORDER };
    }

    const [field, order] = orderBy.split(':');
    const sortOrder = order === 'asc' ? 1 : -1;

    return { [field]: sortOrder };
  }

  private async updateExistingCategory(
    categoryId: string,
    updateData: UpdateCategoryRequest,
  ): Promise<ICategory> {
    return this.categories.findByIdAndUpdate({ _id: categoryId }, updateData, {
      new: true,
    });
  }

  private async createNewCategory(
    model: UpdateCategoryRequest,
  ): Promise<ICategory> {
    const existingCategory = await this.categories.findOne({
      name: model.name,
    });

    if (existingCategory) {
      throw new BadRequestException(
        `Category [ ${model.name} ] already exists`,
      );
    }

    return this.categories.create(model);
  }

  private async validateCategoryDeletion(catId: string): Promise<void> {
    const articleCount = await this.articleService.getCountByCategoryId(catId);

    if (articleCount > 0) {
      throw new BadRequestException('Cannot delete this category');
    }
  }
}

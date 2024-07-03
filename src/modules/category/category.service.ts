import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CategoryDto,
  QueryPaginationDto,
} from 'src/models/dtos/request.dtos/request.dtos';
import { ICategory } from 'src/models/dtos/response.dtos/category';
import { Pagination } from 'src/models/dtos/response.dtos/pagination';
import { CategoryInterface } from 'src/interfaces/category.interface';
import { Category } from 'src/models/schemas/category.schema';
import { ArticleService } from '../article/article.service';

@Injectable()
export class CategoryService implements CategoryInterface {
  constructor(
    @InjectModel(Category.name)
    private categories: Model<ICategory>,
    private articleService: ArticleService,
  ) {}

  async getPagination(
    query: QueryPaginationDto,
  ): Promise<Pagination<ICategory[]>> {
    const { offset, pageSize, orderBy, q } = query;
    const searchQ = {
      name: {
        $regex: q,
        $options: 'i',
      },
    };

    const data = await this.categories.aggregate([
      { $match: q ? searchQ : {} },
      { $sort: { [orderBy || 'createdAt']: -1 } },
      { $skip: parseInt(offset) },
      { $limit: parseInt(pageSize) },
      {
        $lookup: {
          from: 'users',
          let: { userId: { $toObjectId: '$createdBy' } },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$_id', '$$userId'] }] } } },
          ],
          as: 'create',
        },
      },
      { $unwind: { path: '$create', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          let: { userId: { $toObjectId: '$updatedBy' } },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$_id', '$$userId'] }] } } },
          ],
          as: 'update',
        },
      },
      { $unwind: { path: '$update', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          createdBy: '$create.name',
          updatedBy: '$update.name',
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return {
      data,
      total: (await this.categories.countDocuments()) ?? 0,
    };
  }

  async getById(id: string): Promise<ICategory> {
    return this.categories.findById(id);
  }

  async update(catId: string, model: CategoryDto): Promise<ICategory> {
    if (catId)
      return this.categories.findByIdAndUpdate({ _id: catId }, model, {
        new: true,
      });
    else {
      const cat = await this.categories.findOne({ name: model.name });
      if (cat)
        throw new BadRequestException(
          `Category [ ${model.name} ] already exists`,
        );

      return this.categories.create(model);
    }
  }

  async delete(catId: string): Promise<void> {
    const count = await this.articleService.getCountByCategoryId(catId);
    if (count > 0)
      throw new BadRequestException('can not delete this category');
    await this.categories.deleteOne({ _id: catId });
  }
}

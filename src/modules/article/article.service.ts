import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Pagination } from 'src/models/dtos/pagination';
import {
  UpdateArticleRequest,
  UpdateQueryArticleRequest,
  CreateArticleRequest,
} from 'src/models/requests';
import { IArticle } from 'src/models/dtos/article';
import { Article } from 'src/models/schemas/article.schema';
import { ArticleInterface } from 'src/interfaces/article.interface';
import {
  createSlug,
  generateMetaTitle,
  generateMetaDescription,
} from 'src/utils/slug.utils';

@Injectable()
export class ArticleService implements ArticleInterface {
  constructor(
    @InjectModel(Article.name)
    private articles: Model<IArticle>,
  ) {}

  async getPagination(
    query: UpdateQueryArticleRequest,
  ): Promise<Pagination<IArticle[]>> {
    const { offset, pageSize, orderBy, q, categoryId } = query;

    const matchStage = this.buildMatchStage(categoryId, q);
    const pipeline = this.buildAggregationPipeline(
      matchStage,
      orderBy,
      offset,
      pageSize,
    );

    const data = await this.articles.aggregate(pipeline);
    const total = await this.articles.countDocuments();

    return {
      data,
      total: total ?? 0,
    };
  }

  private buildMatchStage(categoryId?: string, q?: string) {
    const match: any = {};

    if (categoryId) {
      match.categoryId = categoryId;
    }

    if (q) {
      match.$or = [
        { title: { $regex: q, $options: 'i' } },
        { metaTitle: { $regex: q, $options: 'i' } },
        { metaDescription: { $regex: q, $options: 'i' } },
        { keywords: { $in: [new RegExp(q, 'i')] } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    return match;
  }

  private buildAggregationPipeline(
    matchStage: any,
    orderBy: string = 'createdAt',
    offset: string = '0',
    pageSize: string = '10',
  ): PipelineStage[] {
    return [
      { $match: matchStage },
      { $sort: { [orderBy]: -1 as const } },
      { $skip: parseInt(offset) },
      { $limit: parseInt(pageSize) },
      this.buildCategoryLookup(),
      this.buildUserLookup('authorId', 'author'),
      this.buildProjectStage(),
    ];
  }

  private buildCategoryLookup(): PipelineStage {
    return {
      $lookup: {
        from: 'categories',
        let: {
          categoryId: { $toObjectId: '$categoryId' },
        },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$categoryId'] },
            },
          },
        ],
        as: 'category',
      },
    } as PipelineStage;
  }

  private buildUserLookup(userField: string, alias: string): PipelineStage {
    return {
      $lookup: {
        from: 'users',
        let: {
          userId: { $toObjectId: `$${userField}` },
        },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$userId'] },
            },
          },
        ],
        as: alias,
      },
    } as PipelineStage;
  }

  private buildProjectStage(): PipelineStage {
    return {
      $project: {
        _id: 0,
        id: '$_id',
        title: 1,
        slug: 1,
        metaTitle: 1,
        metaDescription: 1,
        keywords: 1,
        ogTitle: 1,
        ogDescription: 1,
        ogImage: 1,
        ogType: 1,
        structuredData: 1,
        content: 1,
        summary: 1,
        authorId: 1,
        authorName: '$author.name',
        categoryId: '$category._id',
        categoryName: '$category.name',
        tags: 1,
        coverImage: 1,
        imageAlt: 1,
        relatedPosts: 1,
        views: 1,
        likes: 1,
        averageRating: 1,
        commentCount: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    } as PipelineStage;
  }

  async getContentById(id: string): Promise<IArticle> {
    return this.articles.findById(id);
  }

  async update(
    articleId: string,
    model: UpdateArticleRequest | CreateArticleRequest,
  ): Promise<IArticle> {
    // Tự động tạo slug nếu không được cung cấp
    if (!model.slug && model.title) {
      model.slug = createSlug(model.title);
    }

    // Tự động tạo metaTitle nếu không được cung cấp
    if (!model.metaTitle && model.title) {
      model.metaTitle = generateMetaTitle(model.title);
    }

    // Tự động tạo metaDescription nếu không được cung cấp
    if (!model.metaDescription && model.content) {
      model.metaDescription = generateMetaDescription(model.content);
    }

    if (articleId) {
      return this.articles.findByIdAndUpdate({ _id: articleId }, model, {
        new: true,
      });
    }

    return this.articles.create({ ...model });
  }

  async delete(articleId: string): Promise<void> {
    await this.articles.deleteOne({ _id: articleId });
  }

  async getCountByCategoryId(categoryId: string): Promise<number> {
    return this.articles.countDocuments({ categoryId });
  }

  async incrementViews(articleId: string): Promise<void> {
    await this.articles.findByIdAndUpdate(
      { _id: articleId },
      { $inc: { views: 1 } },
    );
  }

  async incrementLikes(articleId: string): Promise<void> {
    await this.articles.findByIdAndUpdate(
      { _id: articleId },
      { $inc: { likes: 1 } },
    );
  }

  async updateRating(articleId: string, rating: number): Promise<void> {
    // Tính toán rating trung bình mới
    const article = await this.articles.findById(articleId);
    if (article) {
      const newAverageRating = (article.averageRating + rating) / 2;
      await this.articles.findByIdAndUpdate(
        { _id: articleId },
        { averageRating: Math.min(5, Math.max(0, newAverageRating)) },
      );
    }
  }

  async incrementCommentCount(articleId: string): Promise<void> {
    await this.articles.findByIdAndUpdate(
      { _id: articleId },
      { $inc: { commentCount: 1 } },
    );
  }

  async getRelatedPosts(
    articleId: string,
    limit: number = 5,
  ): Promise<IArticle[]> {
    const article = await this.articles.findById(articleId);
    if (!article) return [];

    const matchStage = {
      _id: { $ne: articleId },
      $or: [
        { categoryId: article.categoryId },
        { tags: { $in: article.tags } },
        { keywords: { $in: article.keywords } },
      ],
    };

    return this.articles
      .find(matchStage)
      .sort({ views: -1, createdAt: -1 })
      .limit(limit);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Pagination } from 'src/models/dtos/pagination';
import { IComment } from 'src/models/dtos/comment';
import {
  UpdateQueryCommentRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
} from 'src/models/requests';
import { Comment } from 'src/models/schemas/comment.schema';
import { CommentInterface } from 'src/interfaces/comment.interface';

@Injectable()
export class CommentService implements CommentInterface {
  constructor(
    @InjectModel(Comment.name)
    private comments: Model<IComment>,
  ) {}

  async getPagination(
    query: UpdateQueryCommentRequest,
  ): Promise<Pagination<IComment[]>> {
    const { offset, pageSize, orderBy, q, postId, userId } = query;

    const matchStage = this.buildMatchStage(postId, userId, q);
    const pipeline = this.buildAggregationPipeline(
      matchStage,
      orderBy,
      offset,
      pageSize,
    );

    const data = await this.comments.aggregate(pipeline);
    const total = await this.comments.countDocuments(matchStage);

    return {
      data,
      total: total ?? 0,
    };
  }

  private buildMatchStage(postId?: string, userId?: string, q?: string) {
    const match: any = {};

    if (postId) {
      match.postId = postId;
    }

    if (userId) {
      match.userId = userId;
    }

    if (q) {
      match.$or = [{ content: { $regex: q, $options: 'i' } }];
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
      this.buildUserLookup('userId', 'user'),
      this.buildProjectStage(),
    ];
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
        postId: 1,
        userId: 1,
        userName: '$user.name',
        userEmail: '$user.email',
        content: 1,
        rating: 1,
        likes: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    } as PipelineStage;
  }

  async getById(id: string): Promise<IComment> {
    return this.comments.findById(id);
  }

  async getByPostId(postId: string): Promise<IComment[]> {
    const pipeline = [
      { $match: { postId } },
      { $sort: { createdAt: -1 as const } },
      this.buildUserLookup('userId', 'user'),
      this.buildProjectStage(),
    ];

    return this.comments.aggregate(pipeline);
  }

  async update(
    commentId: string,
    model: UpdateCommentRequest | CreateCommentRequest,
  ): Promise<IComment> {
    if (commentId) {
      return this.comments.findByIdAndUpdate({ _id: commentId }, model, {
        new: true,
      });
    }

    return this.comments.create({ ...model });
  }

  async delete(commentId: string): Promise<void> {
    await this.comments.deleteOne({ _id: commentId });
  }

  async incrementLikes(commentId: string): Promise<void> {
    await this.comments.findByIdAndUpdate(
      { _id: commentId },
      { $inc: { likes: 1 } },
    );
  }

  async updateRating(commentId: string, rating: number): Promise<void> {
    await this.comments.findByIdAndUpdate({ _id: commentId }, { rating });
  }

  async getReplies(commentId: string): Promise<IComment[]> {
    const pipeline = [
      { $match: { parentCommentId: commentId } },
      { $sort: { createdAt: 1 as const } },
      this.buildUserLookup('userId', 'user'),
      this.buildProjectStage(),
    ];

    return this.comments.aggregate(pipeline);
  }

  async getByUserId(userId: string): Promise<IComment[]> {
    const pipeline = [
      { $match: { userId } },
      { $sort: { createdAt: -1 as const } },
      this.buildUserLookup('userId', 'user'),
      this.buildProjectStage(),
    ];

    return this.comments.aggregate(pipeline);
  }

  async getCommentsWithReplies(postId: string): Promise<IComment[]> {
    const pipeline = [
      { $match: { postId, parentCommentId: { $exists: false } } },
      { $sort: { createdAt: -1 as const } },
      this.buildUserLookup('userId', 'user'),
      this.buildProjectStage(),
    ];

    const comments = await this.comments.aggregate(pipeline);

    // Get replies for each comment
    for (const comment of comments) {
      const replies = await this.getReplies(comment.id);
      comment.replies = replies;
    }

    return comments;
  }

  async decrementLikes(commentId: string): Promise<void> {
    await this.comments.findByIdAndUpdate(
      { _id: commentId },
      { $inc: { likes: -1 } },
    );
  }

  async getCommentStatistics(postId: string): Promise<{
    totalComments: number;
    averageRating: number;
    totalLikes: number;
    commentCount: number;
  }> {
    const pipeline = [
      { $match: { postId } },
      {
        $group: {
          _id: null,
          totalComments: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalLikes: { $sum: '$likes' },
        },
      },
    ];

    const result = await this.comments.aggregate(pipeline);
    const stats = result[0] || {
      totalComments: 0,
      averageRating: 0,
      totalLikes: 0,
    };

    return {
      totalComments: stats.totalComments,
      averageRating: Math.round(stats.averageRating * 10) / 10,
      totalLikes: stats.totalLikes,
      commentCount: stats.totalComments,
    };
  }

  async getTopRatedComments(
    postId: string,
    limit: number = 5,
  ): Promise<IComment[]> {
    const pipeline = [
      { $match: { postId, rating: { $exists: true, $ne: null } } },
      { $sort: { rating: -1 as const, createdAt: -1 as const } },
      { $limit: limit },
      this.buildUserLookup('userId', 'user'),
      this.buildProjectStage(),
    ];

    return this.comments.aggregate(pipeline);
  }
}

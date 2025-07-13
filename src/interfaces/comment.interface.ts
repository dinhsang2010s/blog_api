import { Pagination } from 'src/models/dtos/pagination';
import { IComment } from 'src/models/dtos/comment';
import {
  UpdateQueryCommentRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
} from 'src/models/requests';

export interface CommentInterface {
  getPagination(
    query: UpdateQueryCommentRequest,
  ): Promise<Pagination<IComment[]>>;
  getById(id: string): Promise<IComment>;
  getByPostId(postId: string): Promise<IComment[]>;
  update(
    commentId: string,
    model: UpdateCommentRequest | CreateCommentRequest,
  ): Promise<IComment>;
  delete(commentId: string): Promise<void>;
  incrementLikes(commentId: string): Promise<void>;
  updateRating(commentId: string, rating: number): Promise<void>;
  getReplies(commentId: string): Promise<IComment[]>;
  getByUserId(userId: string): Promise<IComment[]>;
  getCommentsWithReplies(postId: string): Promise<IComment[]>;
  decrementLikes(commentId: string): Promise<void>;
  getCommentStatistics(postId: string): Promise<{
    totalComments: number;
    averageRating: number;
    totalLikes: number;
    commentCount: number;
  }>;
  getTopRatedComments(postId: string, limit?: number): Promise<IComment[]>;
}

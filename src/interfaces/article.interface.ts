import {
  UpdateArticleRequest,
  UpdateQueryArticleRequest,
  CreateArticleRequest,
} from 'src/models/requests';
import { Pagination } from 'src/models/dtos/pagination';
import { IArticle } from 'src/models/dtos/article';

export interface ArticleInterface {
  getPagination(
    query: UpdateQueryArticleRequest,
  ): Promise<Pagination<IArticle[]>>;

  getContentById(id: string): Promise<IArticle>;

  update(
    postId: string,
    model: UpdateArticleRequest | CreateArticleRequest,
  ): Promise<IArticle>;

  delete(postId: string): Promise<void>;

  getCountByCategoryId(categoryId: string): Promise<number>;

  incrementViews(articleId: string): Promise<void>;

  incrementLikes(articleId: string): Promise<void>;

  updateRating(articleId: string, rating: number): Promise<void>;

  incrementCommentCount(articleId: string): Promise<void>;

  getRelatedPosts(articleId: string, limit?: number): Promise<IArticle[]>;
}

import {
  ArticleDto,
  QueryPaginationDto,
} from 'src/models/dtos/request.dtos/request.dtos';
import { Pagination } from 'src/models/dtos/response.dtos/pagination';
import { IArticle } from 'src/models/dtos/response.dtos/article';

export interface ArticleInterface {
  getPagination(query: QueryPaginationDto): Promise<Pagination<IArticle[]>>;

  getContentById(id: string): Promise<IArticle>;

  update(postId: string, model: ArticleDto): Promise<IArticle>;

  delete(postId: string): Promise<void>;

  getCountByCategoryId(categoryId: string): Promise<number>;
}

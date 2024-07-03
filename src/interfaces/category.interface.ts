import {
  CategoryDto,
  QueryPaginationDto,
} from 'src/models/dtos/request.dtos/request.dtos';
import { ICategory } from 'src/models/dtos/response.dtos/category';
import { Pagination } from 'src/models/dtos/response.dtos/pagination';

export interface CategoryInterface {
  getPagination(query: QueryPaginationDto): Promise<Pagination<ICategory[]>>;

  update(catId: string, model: CategoryDto): Promise<ICategory>;

  delete(catId: string): Promise<void>;
}

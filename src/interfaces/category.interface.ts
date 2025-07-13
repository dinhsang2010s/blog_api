import { UpdateCategoryRequest } from 'src/models/requests';
import { ICategory } from 'src/models/dtos/category';

export interface CategoryInterface {
  get(q?: string, orderBy?: string): Promise<ICategory[]>;
  update(catId: string, model: UpdateCategoryRequest): Promise<ICategory>;
  delete(catId: string): Promise<void>;
}

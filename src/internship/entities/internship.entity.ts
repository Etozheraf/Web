import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';

export class Internship {
  id: number;
  name: string;
  date: string;
  imgUrl: string;
  companyUrl: string;
  closed: boolean;

  category: Category;
  tags: Tag[];
}

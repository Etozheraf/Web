import { Category } from '../entities/category.entity';

export class ResponseCategoryDto {
  href: string;
  active: boolean;
  label: string;

  constructor(category: Category, categoryName: string) {
    this.href = `/internship/${category.name}`;
    this.active = category.name === categoryName;
    this.label = category.name;
  }
}

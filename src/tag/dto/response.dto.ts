import { Tag } from '../entities/tag.entity';

export class ResponseTagDto {
  href: string;
  active: boolean;
  label: string;

  constructor(tag: Tag, tagName: string) {
    this.href = `/internship?tag=${tag.name}`;
    this.active = tag.name === tagName;
    this.label = tag.name;
  }
}

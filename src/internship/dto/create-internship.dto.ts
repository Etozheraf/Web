export class CreateInternshipDto {
  name: string;
  category: string;
  date: string;
  imgUrl: string;
  url: string;
  closed?: boolean;
  tagIds?: number[];
}

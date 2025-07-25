export class CreateRequestDto {
  name: string;
  status: 'Active' | 'Closed';
  dates: string;

  userId: number;
  internshipId: number;
}

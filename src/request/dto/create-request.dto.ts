export class CreateRequestDto {
  internshipId: number;
  userId: number;
  status?: 'Active' | 'Closed';
  date?: string;
}

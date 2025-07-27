export class CreateRequestDto {
  name: string;
  status: 'Active' | 'Closed';
  dates: string;

  userUuid: string;
  internshipUuid: string;
}

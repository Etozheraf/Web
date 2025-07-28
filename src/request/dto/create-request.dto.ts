export class CreateRequestDto {
  name: string;
  internshipName: string;
  status: 'Active' | 'Closed';
  dates: string;
  category: string;

  userUuid: string;
  internshipUuid: string;
}

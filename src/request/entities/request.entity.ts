import { Internship } from '../../internship/entities/internship.entity';
import { User } from '../../user/entities/user.entity';

export class Request {
  id: number;
  name: string;
  status: string;
  dates: string;

  internship: Internship;
  user: User;
}

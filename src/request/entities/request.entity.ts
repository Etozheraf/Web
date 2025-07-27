import { Internship } from '../../internship/entities/internship.entity';
import { User } from '../../user/entities/user.entity';

export class Request {
  uuid: string;
  name: string;
  status: string;
  dates: string;

  internship: Internship;
  user: User;
}

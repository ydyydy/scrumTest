import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { PASSWORD_PATTERN } from '../../../common/utils/Constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_PATTERN, {
    message:
      'The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsNotEmpty()
  isAdmin: boolean;
}

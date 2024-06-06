import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  email: string;

  @IsString()
  // @MinLength(8, { message: 'Password is too short. It should be at least 8 characters long.' })
  // @MaxLength(20, { message: 'Password is too long. It should be at most 20 characters long.' })
  // @Matches(/(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*)/, {
  //   message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  // })
  password: string;
}

import { Controller, Post, Body, ValidationPipe, Patch, UseGuards, Req, ConflictException, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ message: string }> {
    try {
      return await this.authService.signUp(authCredentialsDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException({ message: error.message }, HttpStatus.CONFLICT);
      } else {
        throw new HttpException({ message: 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    try {
      return await this.authService.signIn(authCredentialsDto);
    } catch (error) {
      throw new HttpException({ message: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);
    }
  }

  @Patch('/changepassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req, @Body('newPassword', ValidationPipe) newPassword: string): Promise<{ message: string }> {
    try {
      const user = req.user;
      return await this.authService.changePassword(user.email, newPassword);
    } catch (error) {
      throw new HttpException({ message: error.message }, error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

import { Controller, Post, Body, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    console.log("authCredentialsDto", authCredentialsDto);
    
    return this.usersService.createUser(authCredentialsDto);
  }

  @Get('/:id')
  async findOneById(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Patch('/changepassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body('newPassword') newPassword: string): Promise<void> {
    const user = req.user;
    return this.usersService.changePassword(user.email, newPassword);
  }
}

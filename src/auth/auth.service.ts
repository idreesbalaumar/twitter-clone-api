import { Injectable, UnauthorizedException, HttpException, HttpStatus, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ message: string }> {
        const { email } = authCredentialsDto;
        const user: User | undefined = await this.usersService.findOneByEmail(email);
        if (user) {
            throw new ConflictException('Email already in use');
        }
        await this.usersService.createUser(authCredentialsDto);
        return { message: 'User created successfully' };
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const user: User | null = await this.usersService.validateUserPassword(authCredentialsDto);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { email: user.email };
        const accessToken: string = this.jwtService.sign(payload);
        return { accessToken };
    }

    async changePassword(email: string, newPassword: string): Promise<{ message: string }> {
        const user: User | undefined = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.usersService.changePassword(email, newPassword);
        return { message: 'Password changed successfully' };
    }
}

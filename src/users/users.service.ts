import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Inject User entity here
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;
    const user = this.userRepository.create({ email, password });
    await user.setPassword(password);
    await this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { email, password } = authCredentialsDto;
    const user = await this.findOneByEmail(email);
    if (user && await user.validatePassword(password)) {
      return user;
    }
    return null;
  }

  async changePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.setPassword(newPassword);
    await this.userRepository.save(user);
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}

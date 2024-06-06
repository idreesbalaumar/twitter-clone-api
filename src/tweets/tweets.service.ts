import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private tweetsRepository: Repository<Tweet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRepository) // Inject UserRepository
    private readonly userRepository: UserRepository,
  ) {}

  async createTweet(createTweetDto: CreateTweetDto): Promise<Tweet> {
    const { content, users } = createTweetDto;
    const tweetUsers = await this.usersRepository.findByIds(users);
    const tweet = this.tweetsRepository.create({ content, users: tweetUsers });
    const savedTweet = await this.tweetsRepository.save(tweet);

    this.sendEmailNotification(tweetUsers, savedTweet.content);

    return savedTweet;
  }

  async getTweets(userId: number): Promise<Tweet[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['tweets'] });
    return user ? user.tweets : [];
  }

  async getSharedTweets(userId: number): Promise<Tweet[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['sharedTweets'] });
    return user ? user.sharedTweets : [];
  }

  private sendEmailNotification(users: User[], tweetContent: string) {
    users.forEach(user => {
      console.log(`Email sent to ${user.email}: ${tweetContent}`);
    });
  }
}

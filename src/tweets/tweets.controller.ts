import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';

@Controller('api/tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  async createTweet(@Body() createTweetDto: CreateTweetDto) {
    return this.tweetsService.createTweet(createTweetDto);
  }

  @Get(':userId')
  async getTweets(@Param('userId') userId: number) {
    return this.tweetsService.getTweets(userId);
  }

  @Get('shared/:userId')
  async getSharedTweets(@Param('userId') userId: number) {
    return this.tweetsService.getSharedTweets(userId);
  }
}

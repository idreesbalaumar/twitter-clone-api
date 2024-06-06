import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    ManyToMany,
  } from 'typeorm';
  import * as bcrypt from 'bcryptjs';
  import { Tweet } from 'src/tweets/tweet.entity';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    email: string;
  
    // @Column()
    name: string;
  
    @Column()
    password: string;
  
    @ManyToMany(() => Tweet, tweet => tweet.users)
    tweets: Tweet[];
  
    @ManyToMany(() => Tweet, tweet => tweet.sharedUsers)
    sharedTweets: Tweet[];
  
    // @BeforeInsert()
    // @BeforeUpdate()
    async setPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(password, salt);
      }
  
      async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
      }
  }
  
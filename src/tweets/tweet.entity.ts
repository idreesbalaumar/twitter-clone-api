import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToMany(() => User, user => user.tweets)
  @JoinTable()
  users: User[];

  @ManyToMany(() => User, user => user.sharedTweets)
  @JoinTable()
  sharedUsers: User[];
}

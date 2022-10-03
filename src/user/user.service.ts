import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor(private readonly userRepository: UserRepository){};

  getHello(): string {
    return 'Organization service is working!';
  }

  async createUser(user: User): Promise<void> {
    return await this.userRepository.createUser(user)
  }
}




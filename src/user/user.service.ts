import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async retrieveData(): Promise<void> {
      
    }

    async createUser(user: User): Promise<void> {
        return await this.userRepository.createUser(user);
    }

    async getUser(email: string): Promise<User> {
        return await this.userRepository.getUser(email);
    }

    async updateUser(newUser: User): Promise<void> {
        return await this.userRepository.updateUser(newUser);
    }
}

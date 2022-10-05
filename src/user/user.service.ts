import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(user: User): Promise<void> {
        return await this.userRepository.createUser(user);
    }

    async getUser(email: string): Promise<User> {
        return await this.userRepository.getUser(email);
    }

    async updateUser(newUser: User): Promise<void> {
        return await this.userRepository.updateUser(newUser);
    }

    async deleteUser(email: string): Promise<void> {
        return await this.userRepository.deleteUser(email);
    }
}

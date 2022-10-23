import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository, // @Inject("AUTH_RMQ_SERVICE") private client: ClientProxy,
    ) {}

    async createUser(user: User): Promise<void> {
        await this.userRepository.createUser(user);
    }

    async getUser(email: string): Promise<User> {
        return await this.userRepository.getUser(email);
    }

    async updateUser(newUser: User): Promise<boolean> {
        return await this.userRepository.updateUser(newUser);
    }

    async deleteUser(email: string): Promise<void> {
        await this.userRepository.deleteUser(email);
    }

    async clear2FASecret(email: string): Promise<void> {
        const user = await this.userRepository.getUser(email);
        user.twoFATokenSecret = null;
        await this.userRepository.updateUser(user);
    }

    async set2FASecret(email: string, secret: string): Promise<void> {
        const user = await this.userRepository.getUser(email);
        user.twoFATokenSecret = secret;
        await this.userRepository.updateUser(user);
    }

    async getUsersFromOrganization(org_id: string): Promise<User[]> {
        return await this.userRepository.getUsersFromOrganization(org_id);
    }

    async getUserById(id: string): Promise<User> {
        return await this.userRepository.getUserById(id);
    }
}

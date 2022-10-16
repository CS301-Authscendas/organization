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

    async updateUser(newUser: User): Promise<void> {
        await this.userRepository.updateUser(newUser);
    }

    async deleteUser(email: string): Promise<void> {
        await this.userRepository.deleteUser(email);
    }

    // async testSendMessage(): Promise<void> {
    //     await this.client.send("Test-event", JSON.stringify({ message: "Hello its me daryl" })).subscribe();
    // }

    async clear2FASecret(email: string): Promise<void> {
        const user = await this.userRepository.getUser(email);
        user.twoFATokenSecret = "";
        await this.userRepository.updateUser(user);
    }
    // async testSendUser(user: User) Promise<void> {
    //     await this.client.send("")
    // }
}

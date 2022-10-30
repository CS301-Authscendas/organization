import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { User } from "./user.entity";
import { TwoFATokenObj } from "./user.interface";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository, // @Inject("AUTH_RMQ_SERVICE") private client: ClientProxy,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async createUser(user: User): Promise<void> {
        await this.userRepository.createUser(user);
    }

    async getUser(email: string): Promise<User> {
        Logger.log(this.cacheManager);
        const cached_user: User | undefined = await this.cacheManager.get(email);
        if (cached_user) {
            delete cached_user.password;
            delete cached_user.twoFATokenObj;
            return cached_user;
        }

        const user = await this.userRepository.getUser(email);
        await this.cacheManager.set(email, user);

        delete user.password;
        delete user.twoFATokenObj;

        return user;
    }

    async getFullUser(email: string): Promise<User> {
        const cached_user: User | undefined = await this.cacheManager.get(email);
        if (cached_user) {
            return cached_user;
        }
        return await this.userRepository.getUser(email);
    }

    async updateUser(newUser: User): Promise<boolean> {
        const resp = await this.userRepository.updateUser(newUser);
        this.cacheManager.del(newUser.email);
        return resp;
    }

    async deleteUser(email: string): Promise<void> {
        await this.userRepository.deleteUser(email);
        this.cacheManager.del(email);
    }

    async clear2FASecret(email: string): Promise<void> {
        const user = await this.userRepository.getUser(email);
        user.twoFATokenObj = null;
        await this.userRepository.updateUser(user);
        this.cacheManager.del(email);
    }

    async set2FASecret(email: string, secret: TwoFATokenObj): Promise<void> {
        const user = await this.userRepository.getUser(email);
        user.twoFATokenObj = secret;
        await this.userRepository.updateUser(user);
        this.cacheManager.del(email);
    }

    async getUsersFromOrganization(org_id: string): Promise<User[]> {
        return await this.userRepository.getUsersFromOrganization(org_id);
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.getUserById(id);
        delete user.password;
        delete user.twoFATokenObj;
        return user;
    }
}

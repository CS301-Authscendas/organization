import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { User } from "./user.entity";
import { emailDTO, set2FASecretDTO } from "./user.interface";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("healthcheck")
    getHealth() {
        return "Organization service is working!";
    }

    @Get(":email")
    async getUser(@Param("email") email: string): Promise<User> {
        return await this.userService.getUser(email);
    }

    @Get("test-clear-string")
    async testClear2FA(): Promise<void> {
        return this.userService.clear2FASecret("tester@gmail.com");
    }

    @Get("org/:org_id")
    async getUsersFromOrganization(@Param("org_id") org_id: string): Promise<User[]> {
        return await this.userService.getUsersFromOrganization(org_id);
    }

    @Get("id/:id")
    async getUserById(@Param("id") id: string): Promise<User> {
        return await this.userService.getUserById(id);
    }

    @Post()
    async postUser(@Body() user: User) {
        await this.userService.createUser(user);
    }

    @Put()
    async putUser(@Body() user: User): Promise<boolean> {
        return await this.userService.updateUser(user);
    }

    @Delete(":email")
    async deleteUser(@Param("email") email: string): Promise<void> {
        await this.userService.deleteUser(email);
    }

    @MessagePattern("clear-2FA-secret")
    async clear2FASecret(@Payload() data: emailDTO, @Ctx() context: RmqContext) {
        await this.userService.clear2FASecret(data.email);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        channel.ack(originalMsg);
    }

    @MessagePattern("set-2FA-secret")
    async save2FASecret(@Payload() data: set2FASecretDTO, @Ctx() context: RmqContext) {
        await this.userService.set2FASecret(data.email, data.secret);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        channel.ack(originalMsg);
    }
}

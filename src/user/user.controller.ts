import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("/health")
    getHealth() {
        return "Organization service is working!";
    }

    @Get()
    async getUser(@Query("email") email: string): Promise<User> {
        return await this.userService.getUser(email);
    }

    @Post()
    async postUser(@Body() user: User) {
        await this.userService.createUser(user);
    }

    @Put()
    async putUser(@Body() user: User) {
        await this.userService.updateUser(user);
    }

    @Delete(":email")
    async deleteUser(@Param("email") email: string): Promise<void> {
        await this.userService.deleteUser(email);
    }

    @MessagePattern("clear-2FA-secret")
    async clear2FASecret(data: string) {
        const jsonData = JSON.parse(data);
        const email = jsonData.email;
        // console.log("EMAIL: ", email);
        return this.userService.clear2FASecret(email);
    }

    // @Get("test")
    // testSendMessage(): Promise<void> {
    //     return this.userService.testSendMessage();
    // }

    @Get("test-clear-string")
    async testClear2FA(): Promise<void> {
        return this.userService.clear2FASecret("tester@gmail.com");
    }
}

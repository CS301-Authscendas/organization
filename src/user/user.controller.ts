import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
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
}

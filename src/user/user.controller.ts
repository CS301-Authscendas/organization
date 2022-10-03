import { Body, Controller, Get, Patch, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { plainToClass } from "class-transformer";

@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getHealth() {
        return "Organization service is working!";
    }

    @Get()
    async getUser(@Query() email: string): Promise<User> {
        return this.userService.getUser(email);
    }

    @Post()
    async postUser(@Body() user: User) {
        return await this.userService.createUser(user);
    }

    @Put()
    async putUser(@Body() user: User) {
        return await this.userService.updateUser(user);
    }
}

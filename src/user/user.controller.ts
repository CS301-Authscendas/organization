import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { plainToClass } from "class-transformer";

@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getHello(): string {
        return this.userService.getHello();
    }

    // @UseInterceptors()
    @Post()
    async postUser(@Body() user: User) {
        console.log(user);
        console.log(typeof user);
        // user = plainToClass;
        return await this.userService.createUser(user);
    }
}

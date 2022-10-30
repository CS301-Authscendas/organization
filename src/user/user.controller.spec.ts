import { CacheModule } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

describe("AppController", () => {
    let userController: UserController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, UserRepository],
            imports: [CacheModule.register()],
        }).compile();

        userController = app.get<UserController>(UserController);
    });

    describe("root", () => {
        it('should return "Organization service is working!"', () => {
            expect(userController.getHealth()).toBe("Organization service is working!");
        });
    });
});

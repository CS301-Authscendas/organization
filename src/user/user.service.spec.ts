import { Test, TestingModule } from "@nestjs/testing";
import { status_enum, User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

// let mockQueryBySymbol = jest.fn();

jest.mock("./user.repository", () => ({
    UserRepository: jest.fn().mockImplementation(() => ({
        createUser: jest.fn(),
        getUser: jest.fn(),
        // queryBySymbol: mockQueryBySymbol,
    })),
}));

describe("UserService", () => {
    let userService: UserService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [UserService, UserRepository],
        }).compile();

        userService = app.get<UserService>(UserService);
        userRepository = app.get<UserRepository>(UserRepository);
        jest.clearAllMocks();
    });

    // describe("root", () => {
    //     it('should return "Hello World!"', () => {
    //         expect(userService.getHe()).toBe("Hello World!");
    //     });
    // });

    describe("get user", () => {
        it("should return a user", async () => {
            const user: User = {
                id: "",
                birthDate: new Date(),
                email: "test@gmail.com",
                firstName: "Bobby",
                lastName: "Lim",
                organizationId: ["grab"],
                password: "asdf1234",
                status: status_enum.PENDING,
                twoFATokenSecret: "1234",
                phoneNumber: "91234567",
                updatedAt: new Date().getTime(),
            };
            jest.spyOn(userRepository, "getUser").mockImplementation(() => Promise.resolve(user));
            expect(await userService.getUser(user.email)).toBe(user);
        });
    });

    // describe("get user that does not exist", () => {
    //     it("should not return a user", async () => {
    //         const user: User = {
    //             id: "",
    //             birthDate: new Date(),
    //             email: "test@gmail.com",
    //             firstName: "Bobby",
    //             lastName: "Lim",
    //             organizationId: ["grab"],
    //             password: "asdf1234",
    //             status: status_enum.PENDING,
    //             twoFATokenSecret: "1234",
    //             updatedAt: new Date().getTime(),
    //         };
    //         // const exception = new BadRequestException(`User with email: ${user.email} does not exist`);
    //         const error = `User with email: ${user.email} does not exist`;
    //         jest.spyOn(userRepository, "getUser").mockImplementation(() => Promise.reject(error));
    //         expect(userService.getUser(user.email)).rejects.toThrow(error);
    //         expect(await userService.getUser(user.email)).toBeCalled();
    //     });
    // });

    describe("create user", () => {
        const user: User = {
            id: "",
            birthDate: new Date(),
            email: "test@gmail.com",
            firstName: "Bobby",
            lastName: "Lim",
            organizationId: ["grab"],
            password: "asdf1234",
            status: status_enum.PENDING,
            twoFATokenSecret: "1234",
            phoneNumber: "91234567",
            updatedAt: new Date().getTime(),
        };

        beforeEach(async () => {
            await userService.createUser(user);
        });

        it("should call UserRepository", () => {
            expect(userRepository.createUser).toBeCalledWith(user);
        });
    });
});

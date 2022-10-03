import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createConnection, EntityManager, getEntityManager } from "@typedorm/core";
import { DocumentClientV2 } from "@typedorm/document-client";
import * as AWS from "aws-sdk";
import { plainToClass } from "class-transformer";
import { User } from "./user.entity";
import { userTable } from "./user.table";

@Injectable()
export class UserRepository {
    private documentClient: DocumentClientV2;

    constructor() {
        const configService = new ConfigService();
        AWS.config.update({
            accessKeyId: configService.get("ACCESS_KEY_ID"),
            secretAccessKey: configService.get("SECRET_ACCESS_KEY"),
            region: configService.get("DYNAMO_REGION"),
        });
        this.documentClient = new DocumentClientV2(new AWS.DynamoDB.DocumentClient());

        createConnection({
            table: userTable,
            entities: [User],
            documentClient: this.documentClient, // <-- When documentClient is not provided, TypeDORM defaults to use the DocumentClientV2
        });
    }

    async createUser(user: User): Promise<void> {
        const entityManager: EntityManager = getEntityManager();
        const found_user = await entityManager.findOne(User, { email: user.email });
        if (found_user) {
            throw new BadRequestException("User email already exists");
        }
        await entityManager.create(user);
    }

    async getUser(email: string): Promise<User> {
        const entityManager: EntityManager = getEntityManager();
        const found_user = await entityManager.findOne(User, email);
        if (!found_user) {
            throw new BadRequestException("User email does not exist");
        }
        return found_user;
    }

    async updateUser(newUser: User): Promise<void> {
        console.log(newUser);
        const entityManager: EntityManager = getEntityManager();
        const found_user = await entityManager.findOne(User, { email: newUser.email });
        if (!found_user) {
            throw new BadRequestException("User email does not exist");
        }
        const { email, ...userDetails } = newUser;
        entityManager.update(User, { email }, plainToClass(User, userDetails));
    }
}

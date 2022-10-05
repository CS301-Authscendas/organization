import { BadRequestException, Injectable } from "@nestjs/common";
import { createConnection, EntityManager, getEntityManager } from "@typedorm/core";
import { DocumentClientV2 } from "@typedorm/document-client";
import * as AWS from "aws-sdk";
import { plainToClass } from "class-transformer";
import { User } from "./user.entity";
import { userTable } from "./user.table";

@Injectable()
export class UserRepository {
    private documentClient: DocumentClientV2;
    private USER_CONN = "user_conn";
    private entityManager: EntityManager;

    constructor() {
        this.documentClient = new DocumentClientV2(
            new AWS.DynamoDB.DocumentClient({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
                },
                region: process.env.AWS_DYNAMO_REGION || "",
            }),
        );

        createConnection({
            name: this.USER_CONN,
            table: userTable,
            entities: [User],
            documentClient: this.documentClient, // <-- When documentClient is not provided, TypeDORM defaults to use the DocumentClientV2
        });

        this.entityManager = getEntityManager(this.USER_CONN);
    }

    async createUser(user: User): Promise<void> {
        const found_user = await this.entityManager.findOne(User, { email: user.email });
        if (found_user) {
            throw new BadRequestException("User email already exists");
        }
        await this.entityManager.create(user);
    }

    async getUser(email: string): Promise<User> {
        const found_user = await this.entityManager.findOne(User, { email: email });
        if (!found_user) {
            throw new BadRequestException("User email does not exist");
        }
        return found_user;
    }

    async updateUser(newUser: User): Promise<void> {
        const found_user = await this.entityManager.findOne(User, { email: newUser.email });
        if (!found_user) {
            throw new BadRequestException("User email does not exist");
        }
        const { email, ...userDetails } = newUser;
        this.entityManager.update(User, { email }, plainToClass(User, userDetails));
    }
}

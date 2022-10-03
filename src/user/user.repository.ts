import { Injectable } from "@nestjs/common";
// import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import dbConfig from "../app.config";
import { createConnection } from "@typedorm/core";
import { DocumentClientV2 } from "@typedorm/document-client";
import { userTable } from "./user.table";
import { User } from "./user.entity";
import {getEntityManager} from '@typedorm/core';


@Injectable()
export class UserRepository {
    private tableName: string;
    private documentClient: DocumentClientV2;
    private userPrefix = "USER#";
    

    constructor() {
        AWS.config.update(dbConfig().aws_remote_config);
        // console.log(dbConfig().aws_remote_config);


        this.tableName = "organization";
        this.documentClient = new DocumentClientV2(new AWS.DynamoDB.DocumentClient());

        createConnection({
            table: userTable,
            entities: [User],
            documentClient: this.documentClient, // <-- When documentClient is not provided, TypeDORM defaults to use the DocumentClientV2
        });
    }
  

    async createUser(user: User): Promise<void> {
      
      await getEntityManager().create(user);
    }
}

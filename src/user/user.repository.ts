import { Injectable } from "@nestjs/common";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import { config } from "src/app.config";

@Injectable()
export class UserRepository {
    private tableName: string;
    private db: DocumentClient;

    private userPrefix = "USER#";

    constructor() {
        AWS.config.update(config.aws_remote_config);
        this.tableName = "organization";
        this.db = new AWS.DynamoDB.DocumentClient();
    }

    


}

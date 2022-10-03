import { Injectable } from "@nestjs/common";
import { createConnection, EntityManager, getEntityManager } from "@typedorm/core";
import { DocumentClientV2 } from "@typedorm/document-client";
import * as AWS from "aws-sdk";
import { Organization } from "./organization.entity";
import { organizationTable } from "./organization.table";

@Injectable()
export class OrganizationRepository {
    private documentClient: DocumentClientV2;
    private ORG_CONN = "org_conn";
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
            name: this.ORG_CONN,
            table: organizationTable,
            entities: [Organization],
            documentClient: this.documentClient, // <-- When documentClient is not provided, TypeDORM defaults to use the DocumentClientV2
        });

        this.entityManager = getEntityManager(this.ORG_CONN);
    }

    async createOrganization(org: Organization): Promise<void> {
        await this.entityManager.create(org);
    }
}

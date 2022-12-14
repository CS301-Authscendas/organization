import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { createConnection, EntityManager, getEntityManager } from "@typedorm/core";
import { DocumentClientV2 } from "@typedorm/document-client";
import * as AWS from "aws-sdk";
import { plainToClass } from "class-transformer";
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
        const found_org = await this.entityManager.findOne(Organization, { id: org.id });
        if (found_org) {
            // throw new BadRequestException("Organization with id: ".concat(org.id, " already exists"));
            throw new BadRequestException(`Organization with id: ${org.id} already exists`);
        }
        await this.entityManager.create(org);
    }

    async queryById(id: string): Promise<Organization> {
        // return await null;
        const found_org = await this.entityManager.findOne(Organization, { id: id });
        if (!found_org) {
            throw new BadRequestException(`Organization with id: ${id} does not exist`);
        }
        return found_org;
    }

    async updateOrganization(newOrg: Organization): Promise<void> {
        const found_org = await this.entityManager.findOne(Organization, { id: newOrg.id });
        if (!found_org) {
            throw new BadRequestException(`Organization with id: ${newOrg.id} does not exist`);
        }
        const { id, ...orgDetails } = newOrg;
        await this.entityManager.update(Organization, { id }, plainToClass(Organization, orgDetails));
    }

    async deleteOrganization(id: string): Promise<void> {
        const found_org = await this.entityManager.findOne(Organization, { id: id });
        if (!found_org) {
            throw new BadRequestException(`Organization with id: ${id} does not exist`);
        }
        await this.entityManager.delete(Organization, { id: id });
    }

    async getAllOrganizations(): Promise<Organization[]> {
        const organizations: Organization[] = [];
        const params: any = { TableName: "organization" };
        let resp = await this.documentClient.scan(params);
        let count = 0;
        do {
            resp.Items?.forEach((itemdata: Organization) => {
                Logger.log("Item :", ++count, JSON.stringify(itemdata));
                organizations.push(plainToClass(Organization, itemdata));
            });

            if (typeof resp.LastEvaluatedKey !== "undefined") {
                Logger.log("Scanning for more...");
                params.ExclusiveStartKey = resp.LastEvaluatedKey;
                resp = await this.documentClient.scan(params);
            }
        } while (typeof resp.LastEvaluatedKey !== "undefined");
        return organizations;
    }
}

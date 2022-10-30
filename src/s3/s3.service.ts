import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Cron, CronExpression } from "@nestjs/schedule";
import { S3 } from "aws-sdk";
import { plainToClass } from "class-transformer";
import xlsx from "node-xlsx";
import { Organization } from "src/organization/organization.entity";
import { OrganizationService } from "../organization/organization.service";
import { User } from "../user/user.entity";
import { Role, UserScopes } from "../user/user.interface";
import { UserService } from "../user/user.service";
import { IS3File, SeededEmailParamsDTO } from "./s3.interface";

interface UserDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    birthDate: string;
    role: Role[];
}

@Injectable()
export class S3Service {
    private s3: S3;

    constructor(
        private readonly userService: UserService,
        private readonly organizationService: OrganizationService,
        @Inject("NOTIFICATION_RMQ_SERVICE") private client: ClientProxy,
    ) {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }

    async getExcelFile(bucket: string, fileName: string): Promise<IS3File> {
        const params = { Bucket: bucket, Key: fileName };
        const stream = await this.s3.getObject(params).promise();
        const workbook = xlsx.parse(stream.Body)[0];

        await this.updateDatabase(workbook.data, "MyBank");
        return workbook;
    }

    async syncExcelFile(bucket: string, fileName: string, orgId: string) {
        const params = { Bucket: bucket, Key: fileName };
        try {
            const stream = await this.s3.getObject(params).promise();
            const workbook = xlsx.parse(stream.Body)[0];

            await this.updateDatabase(workbook.data, orgId);
        } catch (error) {
            // When the file cannot be found
            Logger.log(error);
        }
    }

    async updateDatabase(data: Array<unknown>, orgId: string) {
        const promises = [];
        for (let i = 1; i < data.length; i++) {
            const user: any = data[i];
            promises.push(this.addUserToDb(user, orgId));
        }
        await Promise.all(promises);
    }

    async addUserToDb(user: any, orgId: string) {
        let found_user = null;
        try {
            found_user = await this.userService.getUser(user[1]);
        } catch (e) {
            // User does not exist in db
            const user_DTO: UserDTO = {
                id: user[0],
                birthDate: user[5],
                email: user[1],
                firstName: user[2],
                lastName: user[3],
                role: [
                    {
                        organizationId: orgId,
                        permission: [UserScopes.User],
                    },
                ],
                status: user[4],
            };
            const new_user: User = plainToClass(User, user_DTO);
            Logger.log(`Adding new user... ${new_user.email}`);
            // Comment out to prevent email spam
            this.triggerSeededEmail(`${new_user.firstName} ${new_user.lastName}`, new_user.email, new_user.id);
            await this.userService.createUser(new_user);
        }
        // User exists in db but is not part or ogranization
        if (found_user && !found_user.roles.some((role) => role.organizationId === orgId)) {
            found_user.roles.push({
                organizationId: orgId,
                permission: [UserScopes.User],
            });
            Logger.log(`Updating user... ${found_user.email}`);
            await this.userService.updateUser(found_user);
        }
    }

    // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    // async syncDatabases() {
    //     const bucketName = process.env.AWS_S3_BUCKET_NAME;
    //     if (bucketName) await this.syncExcelFile(bucketName, "Project A - users.xlsx", "MyBank");
    // }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async syncAllOrganisation() {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (!bucketName) return;
        const organizations = await this.organizationService.getAllOrganizations();
        const promises: Promise<void>[] = [];
        organizations.map((organization: Organization) => {
            Logger.log(`Syncing for organization ${organization.id} ...`);
            const fileName = organization.id + ".xlsx";
            promises.push(this.syncExcelFile(bucketName, fileName, organization.id));
        });
        await Promise.all(promises);
    }

    async testSendMessage(): Promise<void> {
        await this.triggerSeededEmail("Bobby Lim", "bobbytest6789@gmail.com", "a49b0324-7580-4ee5-83e7-872d977a682a");
    }

    async triggerSeededEmail(name: string, email: string, id: string): Promise<void> {
        const dataObj: SeededEmailParamsDTO = {
            id: id,
            name: name,
            email: email,
        };
        this.client.send("send_seeded_email", dataObj).subscribe();
    }
}

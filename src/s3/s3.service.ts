import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Cron, CronExpression } from "@nestjs/schedule";
import { S3 } from "aws-sdk";
import { plainToClass } from "class-transformer";
import xlsx from "node-xlsx";
import { OrganizationService } from "../organization/organization.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { IS3File, SeededEmailParamsDTO } from "./s3.interface";

interface UserDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    birthDate: string;
    organizationId: Array<string>;
    role: string;
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
        const stream = await this.s3.getObject(params).promise();
        const workbook = xlsx.parse(stream.Body)[0];

        await this.updateDatabase(workbook.data, orgId);
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
            const user_DTO: UserDTO = {
                id: user[0],
                birthDate: user[5],
                email: user[1],
                firstName: user[2],
                lastName: user[3],
                organizationId: [orgId],
                status: user[4],
                role: "user",
            };
            const new_user: User = plainToClass(User, user_DTO);
            Logger.log("Adding new user... ", new_user);
            await this.userService.createUser(new_user);
        }
        if (found_user && !found_user.organizationId.includes(orgId)) {
            found_user.organizationId.push(orgId);
            Logger.log("Updating user... ", found_user);
            await this.userService.updateUser(found_user);
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async syncDatabases() {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (bucketName) await this.syncExcelFile(bucketName, "Project A - users.xlsx", "MyBank");
    }

    async syncAllOrganisation() {
        const organizations = await this.organizationService.getAllOrganizations();
        return organizations;
    }

    async testSendMessage(): Promise<void> {
        await this.triggerSeededEmail("Daryl", "authcendas@gmail.com", "123123123");
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

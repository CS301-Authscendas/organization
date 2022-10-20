import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { S3 } from "aws-sdk";
import { plainToClass } from "class-transformer";
import xlsx from "node-xlsx";
import { OrganizationService } from "../organization/organization.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { IS3File } from "./s3.interface";

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

    constructor(private readonly userService: UserService, private readonly organizationService: OrganizationService) {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }

    async getExcelFile(bucket: string, fileName: string): Promise<IS3File> {
        const params = { Bucket: bucket, Key: fileName };
        const stream = await this.s3.getObject(params).promise();
        const workbook = xlsx.parse(stream.Body)[0];

        this.updateDatabase(workbook.data);
        return workbook;
    }

    async syncExcelFile(bucket: string, fileName: string) {
        const params = { Bucket: bucket, Key: fileName };
        const stream = await this.s3.getObject(params).promise();
        const workbook = xlsx.parse(stream.Body)[0];

        this.updateDatabase(workbook.data);
    }

    async updateDatabase(data: Array<unknown>) {
        const promises = [];
        for (let i = 1; i < data.length; i++) {
            const user: any = data[i];
            promises.push(this.addUserToDb(user));
        }
        await Promise.all(promises);
    }

    async addUserToDb(user: any) {
        try {
            await this.userService.getUser(user[1]);
        } catch (e) {
            const user_DTO: UserDTO = {
                id: user[0],
                birthDate: user[5],
                email: user[1],
                firstName: user[2],
                lastName: user[3],
                organizationId: ["grab"],
                status: user[4],
                role: "user",
            };
            const new_user: User = plainToClass(User, user_DTO);
            Logger.log(new_user);
            await this.userService.createUser(new_user);
        }
    }

    @Cron("*/10 * * * * *")
    tenSecondTimer() {
        // console.log("5 seconds has passed");
        Logger.log("hallo, 10s pass");
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    syncDatabases() {
        this.syncExcelFile("authscendas-excel", "Project A - users.xlsx");
    }
}

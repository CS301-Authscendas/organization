import { Injectable, Logger } from "@nestjs/common";
import { S3 } from "aws-sdk";
import xlsx from "node-xlsx";
import { IS3File } from "./s3.interface";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class S3Service {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }

    async getExcelFile(bucket: string, fileName: string): Promise<IS3File> {
        const params = { Bucket: bucket, Key: fileName };
        const stream = await this.s3.getObject(params).promise();
        const workbook = xlsx.parse(stream.Body)[0];

        return workbook;
    }

    @Cron("*/5 * * * * *")
    handleCron() {
        // console.log("5 seconds has passed");
        Logger.log("hallo, 5s pass");
    }
}

import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";

@Injectable()
export class S3Service {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }

    async getFile(bucket: string, fileName: string) {
        const params = { Bucket: bucket, Key: fileName };
        const s3 = await this.s3.getObject(params).promise();
        console.log(s3.Body?.toString("utf-8"));
    }
}

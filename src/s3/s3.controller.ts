import { Body, Controller, Get } from "@nestjs/common";
import { S3Service } from "./s3.service";

@Controller("/s3")
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Get()
    async getFile(@Body() req: any) {
        return await this.s3Service.getExcelFile(req.bucket, req.fileName);
    }

    @Get("test-send")
    test(): Promise<string> {
        return this.s3Service.testSendMessage();
    }
}

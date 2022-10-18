import { Module } from "@nestjs/common";
import { OrganizationModule } from "src/organization/organization.module";
import { UserModule } from "src/user/user.module";
import { S3Controller } from "./s3.controller";
import { S3Service } from "./s3.service";

@Module({
    imports: [UserModule, OrganizationModule],
    controllers: [S3Controller],
    providers: [S3Service],
    exports: [],
})
export class S3Module {}

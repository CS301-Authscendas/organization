import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OrganizationModule } from "./organization/organization.module";
import { S3Module } from "./s3/s3.module";
import { UserModule } from "./user/user.module";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, OrganizationModule, S3Module],
    controllers: [],
    providers: [],
})
export class AppModule {}

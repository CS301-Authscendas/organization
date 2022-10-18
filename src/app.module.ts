import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { MQModule } from "./mq/mq.module";
import { OrganizationModule } from "./organization/organization.module";
import { S3Module } from "./s3/s3.module";
import { UserModule } from "./user/user.module";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, OrganizationModule, S3Module, MQModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}

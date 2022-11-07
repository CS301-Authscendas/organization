import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OrganizationModule } from "src/organization/organization.module";
import { UserModule } from "src/user/user.module";
import { S3Controller } from "./s3.controller";
import { S3Service } from "./s3.service";

@Module({
    imports: [
        UserModule,
        OrganizationModule,
        ClientsModule.registerAsync([
            {
                name: "NOTIFICATION_RMQ_SERVICE",
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            `${configService.get<string>("RABBITMQ_TRANSPORT_METHOD")}://${configService.get<string>(
                                "RABBITMQ_USER",
                            )}:${configService.get<string>("RABBITMQ_PASSWORD")}@${configService.get<string>(
                                "RABBITMQ_PROD_HOST",
                            )}:${configService.get<string>("RABBITMQ_PORT")}`,
                        ],
                        queue: "notification",
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
            },
        ]),
    ],
    controllers: [S3Controller],
    providers: [S3Service],
    exports: [],
})
export class S3Module {}

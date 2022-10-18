import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        // ClientsModule.registerAsync([
        //     {
        //         name: "AUTH_RMQ_SERVICE",
        //         imports: [ConfigModule],
        //         inject: [ConfigService],
        //         useFactory: async (configService: ConfigService) => ({
        //             transport: Transport.RMQ,
        //             options: {
        //                 urls: [
        //                     `${configService.get<string>("RABBITMQ_TRANSPORT_METHOD")}://${configService.get<string>(
        //                         "RABBITMQ_USER",
        //                     )}:${configService.get<string>("RABBITMQ_PASSWORD")}@${configService.get<string>(
        //                         "RABBITMQ_HOST",
        //                     )}:${configService.get<string>("RABBITMQ_PORT")}`,
        //                 ],
        //                 queue: "auth",
        //                 queueOptions: {
        //                     durable: true,
        //                 },
        //                 noAck: true,
        //             },
        //         }),
        //     },
        // ]),
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MQService } from "./mq.service";

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [MQService],
    exports: [MQService],
})
export class MQModule {}

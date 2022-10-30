import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import "reflect-metadata";
import { AppModule } from "./app.module";
import { MQService } from "./mq/mq.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const mqService = app.get<MQService>(MQService);
    app.connectMicroservice(mqService.getOptions("user"));

    const configService = app.get(ConfigService);
    await app.startAllMicroservices();
    await app.listen(configService.get("PORT") ?? 3002);
}
bootstrap();

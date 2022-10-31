import { Logger, ValidationPipe } from "@nestjs/common";
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

    const port = configService.get("PORT");
    Logger.log("Starting service on PORT --- " + port);
    await app.listen(port ?? 3002);
}
bootstrap();

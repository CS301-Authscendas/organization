import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import "reflect-metadata";
import { AppModule } from "./app.module";
import { MQService } from "./mq/mq.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const mqService = app.get<MQService>(MQService);
    app.connectMicroservice(mqService.getOptions("user"));

    await app.startAllMicroservices();
    await app.listen(3000);
}
bootstrap();

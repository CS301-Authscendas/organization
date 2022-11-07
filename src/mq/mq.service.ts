import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class MQService {
    constructor(private readonly configService: ConfigService) {}

    getOptions(queueName: string, noAck = false): RmqOptions {
        const user = this.configService.get<string>("RABBITMQ_USER");
        const password = this.configService.get<string>("RABBITMQ_PASSWORD");
        const host =
            process.env.NODE_ENV === "production"
                ? this.configService.get<string>("RABBITMQ_PROD_HOST")
                : this.configService.get<string>("RABBITMQ_HOST");
        const port = this.configService.get<string>("RABBITMQ_PORT");

        Logger.log(host);
        // const queueName = this.configService.get<string>("RABBITMQ_QUEUE_NAME");

        return {
            transport: Transport.RMQ,
            options: {
                urls: [`amqps://${user}:${password}@${host}:${port}`],
                queue: queueName,
                noAck,
                persistent: true,
            },
        };
    }

    ack(context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage);
    }
}

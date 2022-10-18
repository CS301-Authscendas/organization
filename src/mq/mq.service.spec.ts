import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { MQService } from "./mq.service";

describe("NotificationService", () => {
    let service: MQService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            providers: [MQService],
        }).compile();

        service = module.get<MQService>(MQService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});

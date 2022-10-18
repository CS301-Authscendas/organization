import { Test, TestingModule } from "@nestjs/testing";
import { OrganizationModule } from "src/organization/organization.module";
import { UserModule } from "src/user/user.module";
import { S3Service } from "./s3.service";

describe("S3Service", () => {
    let service: S3Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UserModule, OrganizationModule],
            providers: [S3Service],
        }).compile();

        service = module.get<S3Service>(S3Service);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});

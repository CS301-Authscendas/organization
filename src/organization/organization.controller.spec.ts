import { Test, TestingModule } from "@nestjs/testing";
import { OrganizationController } from "./organization.controller";
import { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";

describe("OrganizationController", () => {
    let controller: OrganizationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrganizationController],
            providers: [OrganizationService, OrganizationRepository],
        }).compile();

        controller = module.get<OrganizationController>(OrganizationController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});

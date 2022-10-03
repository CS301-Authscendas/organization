import { Body, Controller, Post } from "@nestjs/common";
import { Organization } from "./organization.entity";
import { OrganizationService } from "./organization.service";

@Controller("organization")
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Post()
    async postUser(@Body() organization: Organization) {
        return await this.organizationService.createOrganization(organization);
    }
}

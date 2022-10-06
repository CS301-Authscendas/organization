import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Organization } from "./organization.entity";
import { OrganizationService } from "./organization.service";

@Controller("organization")
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Post()
    async postOrganization(@Body() organization: Organization) {
        return await this.organizationService.createOrganization(organization);
    }

    @Get()
    async getOrganization(@Query("id") id: string) {
        return await this.organizationService.getOrganization(id);
    }

    @Put()
    async putOrganization(@Body() organization: Organization) {
        return await this.organizationService.updateOrganization(organization);
    }

    @Delete(":id")
    async deleteOrganization(@Param("id") id: string) {
        return await this.organizationService.deleteOrganization(id);
    }
}

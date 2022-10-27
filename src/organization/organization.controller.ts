import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Organization } from "./organization.entity";
import { OrganizationService } from "./organization.service";

interface getOrgsRequest {
    ids: string[];
}

@Controller("organization")
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Post()
    async postOrganization(@Body() organization: Organization) {
        await this.organizationService.createOrganization(organization);
    }

    @Get(":id")
    async getOrganization(@Param("id") id: string) {
        return await this.organizationService.getOrganization(id);
    }

    @Put()
    async putOrganization(@Body() organization: Organization) {
        await this.organizationService.updateOrganization(organization);
    }

    @Delete(":id")
    async deleteOrganization(@Param("id") id: string) {
        await this.organizationService.deleteOrganization(id);
    }

    @Get()
    async getAll() {
        return await this.organizationService.getAllOrganizations();
    }

    @Post("fetch-organizations")
    async fetchOrganizations(@Body() requestBody: getOrgsRequest) {
        return await this.organizationService.getOrganizationsByList(requestBody.ids);
    }
}

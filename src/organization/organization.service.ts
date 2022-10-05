import { Injectable } from "@nestjs/common";
import { Organization } from "./organization.entity";
import { OrganizationRepository } from "./organization.repository";

@Injectable()
export class OrganizationService {
    constructor(private readonly organizationRepository: OrganizationRepository) {}

    async createOrganization(organization: Organization): Promise<void> {
        return await this.organizationRepository.createOrganization(organization);
    }

    async getOrganization(id: string): Promise<Organization> {
        return await this.organizationRepository.queryById(id);
    }

    async updateOrganization(organization: Organization): Promise<void> {
        return await this.organizationRepository.updateOrganization(organization);
    }

    async deleteOrganization(id: string): Promise<void> {
        return await this.organizationRepository.deleteOrganization(id);
    }
}

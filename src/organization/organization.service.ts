import { Injectable } from "@nestjs/common";
import { Organization } from "./organization.entity";
import { OrganizationRepository } from "./organization.repository";

@Injectable()
export class OrganizationService {
    constructor(private readonly organizationRepository: OrganizationRepository) {}

    async createOrganization(organization: Organization): Promise<void> {
        return await this.organizationRepository.createOrganization(organization);
    }
}

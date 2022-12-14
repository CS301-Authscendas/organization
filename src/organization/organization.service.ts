import { BadRequestException, Injectable } from "@nestjs/common";
import { Organization } from "./organization.entity";
import { OrganizationRepository } from "./organization.repository";

@Injectable()
export class OrganizationService {
    constructor(private readonly organizationRepository: OrganizationRepository) {}

    async createOrganization(organization: Organization): Promise<void> {
        await this.organizationRepository.createOrganization(organization);
    }

    async getOrganization(id: string): Promise<Organization> {
        return await this.organizationRepository.queryById(id);
    }

    async updateOrganization(organization: Organization): Promise<void> {
        await this.organizationRepository.updateOrganization(organization);
    }

    async deleteOrganization(id: string): Promise<void> {
        await this.organizationRepository.deleteOrganization(id);
    }

    async getAllOrganizations(): Promise<Organization[]> {
        return await this.organizationRepository.getAllOrganizations();
    }

    async getOrganizationsByList(ids: string[]) {
        const promises = [];
        for (let i = 0; i < ids.length; i++) {
            if (ids[i].length === 0) {
                throw new BadRequestException("id cannot be empty");
            }
            promises.push(this.organizationRepository.queryById(ids[i]));
        }
        const orgList: Organization[] = await Promise.all(promises);
        const res = orgList.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name }), {});
        return res;
    }
}
